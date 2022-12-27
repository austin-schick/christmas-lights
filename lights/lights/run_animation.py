import ast
import sys
from typing import Dict
import os

# Animation imports.
from lights.animations import ANIMATIONS
from lights.animations.snake import Snake
from lights.animations.snowflakes import Snowflakes
from lights.animations.down_the_line import DownTheLine
from lights.animations.rainbow_sine import RainbowSine
from lights.animations.color_sine import ColorSine
from lights.animations.moving_rainbow import MovingRainbow
from lights.animations.red_green_swap import RedGreenSwap
from lights.animations.game_of_life import GameOfLife
from lights.animations.single_color import SingleColor
from lights.animations.color_sort import ColorSort
from lights.animations.binary_count import BinaryCount

from lights.animations.base import BaseAnimation

NAME_TO_ANIMATION: Dict[str, BaseAnimation] = {animation.__name__: animation for animation in ANIMATIONS}

def printExampleUsage(animation: BaseAnimation):
  print("Example usage: python", os.path.basename(__file__), animation.exampleUsage())


if __name__ == '__main__':
  # Parse command line arguments.
  animation_name = sys.argv[1]
  animation = NAME_TO_ANIMATION[animation_name]
  kwargs_start = 2
  simulate = False
  if len(sys.argv) >= 3 and sys.argv[2] == '-h':
    printExampleUsage(animation)
    exit(-1)
  elif len(sys.argv) >= 3 and sys.argv[2] == '-s':
    simulate = True
    kwargs_start = 3
  kwargs_list = [arg.split('=') for arg in sys.argv[kwargs_start:]]
  kwargs = dict([(arg[0], ast.literal_eval(arg[1]))for arg in kwargs_list])

  # Setup.
<<<<<<< HEAD
  SIMULATE = True
  if not SIMULATE:
=======
  if not simulate:
>>>>>>> 8dad8b9 (start of readme, auto load animations)
    from neopixel import NeoPixel as LightsController
    from lights.constants import PIN, NUM_PIXELS, ORDER
  else:
    PIN, NUM_PIXELS, ORDER = 0, 500, "RGB"
    from lights.controller.lights_simulator import LightsSimulator
    LightsController = LightsSimulator

  # Run animation.
  pixels = LightsController(PIN, NUM_PIXELS, auto_write=False, pixel_order=ORDER)
  
  try:
    a = animation(pixels, **kwargs)
  except Exception as e:
    printExampleUsage(animation)
    raise e

  a.run()