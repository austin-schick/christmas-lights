from lights.animations.base import BaseAnimation
from lights.utils.colors import decayPixel
import random

class Snowflakes(BaseAnimation):
  def __init__(self, pixels, *, fps=30, density=.005, decayRate=.99, color=(148,231,255)):
    super().__init__(pixels, fps=fps)
    self.density = density
    self.decayRate = decayRate
    self.color = color

  def renderNextFrame(self):
    blank = [0, 0, 0]
    for i in range(len(self.pixels)):
      self.pixels[i] = decayPixel(*self.pixels[i], self.decayRate)
      if self.pixels[i] == list(blank):
        n = random.uniform(0, 1)
        if n < self.density:
          self.pixels[i] = self.color