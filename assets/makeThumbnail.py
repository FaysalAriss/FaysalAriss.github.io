#!/usr/bin/env python3
"""
make_thumbnail.py

Creates a single "contact sheet" style thumbnail image from a video,
made up of evenly-spaced frames pulled across the video's duration.

Requires ffmpeg + ffprobe installed (macOS: `brew install ffmpeg`).

Usage:
    python3 make_thumbnail.py input.mp4
    python3 make_thumbnail.py input.mp4 -o thumb.jpg --cols 4 --rows 3
    python3 make_thumbnail.py input.mp4 --frames 9 --width 1200

Options:
    -o / --output       Output image path (default: <input>_thumb.jpg)
    --cols               Number of grid columns (default: auto)
    --rows               Number of grid rows (default: auto)
    --frames             Total frames to use (default: auto based on duration)
    --width               Width of each tile in pixels (default: 320)
"""

import argparse
import json
import math
import subprocess
import sys
from pathlib import Path


def get_duration(path: str) -> float:
    """Return video duration in seconds using ffprobe."""
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "json", path,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        sys.exit(f"ffprobe failed:\n{result.stderr}")
    data = json.loads(result.stdout)
    try:
        return float(data["format"]["duration"])
    except (KeyError, ValueError):
        sys.exit("Could not determine video duration.")


def auto_frame_count(duration: float) -> int:
    """Pick a sensible number of frames based on video length."""
    if duration <= 30:
        return 6
    elif duration <= 120:
        return 9
    elif duration <= 600:
        return 12
    elif duration <= 1800:
        return 16
    else:
        return 20


def auto_grid(n: int) -> tuple[int, int]:
    """Pick a reasonably square cols x rows grid for n frames."""
    cols = math.ceil(math.sqrt(n))
    rows = math.ceil(n / cols)
    return cols, rows


def main():
    parser = argparse.ArgumentParser(description="Make a grid thumbnail from a video.")
    parser.add_argument("input", help="Path to input video")
    parser.add_argument("-o", "--output", help="Output image path")
    parser.add_argument("--cols", type=int, help="Grid columns")
    parser.add_argument("--rows", type=int, help="Grid rows")
    parser.add_argument("--frames", type=int, help="Total number of frames to sample")
    parser.add_argument("--width", type=int, default=320, help="Width per tile in px (default 320)")
    args = parser.parse_args()

    in_path = Path(args.input)
    if not in_path.exists():
        sys.exit(f"File not found: {in_path}")

    out_path = Path(args.output) if args.output else in_path.with_name(in_path.stem + "_thumb.jpg")

    duration = get_duration(str(in_path))

    n_frames = args.frames or auto_frame_count(duration)

    if args.cols and args.rows:
        cols, rows = args.cols, args.rows
        n_frames = cols * rows
    elif args.cols:
        cols = args.cols
        rows = math.ceil(n_frames / cols)
    elif args.rows:
        rows = args.rows
        cols = math.ceil(n_frames / rows)
    else:
        cols, rows = auto_grid(n_frames)
        n_frames = cols * rows  # keep grid full

    # Sample interval in seconds so frames are spread evenly across the video.
    # Small buffer at start/end avoids grabbing a black first/last frame.
    interval = duration / n_frames
    fps_expr = f"1/{interval:.4f}"

    vf = f"fps={fps_expr},scale={args.width}:-1,tile={cols}x{rows}"

    cmd = [
        "ffmpeg", "-y",
        "-i", str(in_path),
        "-vf", vf,
        "-frames:v", "1",
        "-q:v", "2",
        str(out_path),
    ]

    print(f"Video duration: {duration:.1f}s")
    print(f"Grid: {cols} cols x {rows} rows ({n_frames} frames, one every {interval:.1f}s)")
    print(f"Running: {' '.join(cmd)}")

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        sys.exit(f"ffmpeg failed:\n{result.stderr}")

    print(f"Thumbnail saved to: {out_path}")


if __name__ == "__main__":
    main()
