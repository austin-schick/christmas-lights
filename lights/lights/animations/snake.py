import random
from lights.animations.base import BaseAnimation
from lights.utils.colors import rainbowFrame

class Snake(BaseAnimation):
  def __init__(self, pixels, *, fps=None, numFood=10, foodColor=(255,0,0), isRainbow=False):
    super().__init__(pixels, fps=fps)
    self.numFood = numFood
    self.isRainbow = isRainbow
    self.foodColor = foodColor
    self.food = random.sample(range(len(self.pixels)), self.numFood)
    self.body = [random.randint(0, len(self.pixels) - 1)]
    self.S = set([i for i in range(len(pixels))]) # set of all indices
    
  def renderNextFrame(self):
    NUM_PIXELS = len(self.pixels)
  
    # max length snake
    if len(set(self.body)) == NUM_PIXELS:
      self.food = random.sample(range(NUM_PIXELS), self.numFood)
      self.body = [random.randint(0, NUM_PIXELS - 1)]
      # reset

    # move the snake
    head = self.body[0]
    nearestFood = None
    nearestDist = None
    for i in self.food:
      d = abs(i - head)
      if nearestFood == None or d < nearestDist:
        nearestFood = i
        nearestDist = d

    dir = +1 if nearestFood > head else -1
    newHead = head + dir
    self.body.insert(0, newHead)

    if newHead in self.food:
      self.food.remove(newHead)
      foodOptions = list(self.S - set(self.food) - set(self.body))
      if foodOptions != []:
        self.food.append(random.choice(foodOptions))
    else:
      self.body.pop()

    # update pixels

    if self.isRainbow:
      minBodyIdx = min(self.body)
      uniqueBodyList = list(set(self.body))
      rainbow = rainbowFrame(0, len(uniqueBodyList))
      for i in range(NUM_PIXELS):
        if i in self.food:
          self.pixels[i] = self.foodColor
        elif i in self.body:
          self.pixels[i] = rainbow[i - minBodyIdx]
        else:
          self.pixels[i] = (0, 0, 0)
  
    else:
      for i in range(NUM_PIXELS):
        if i in self.food:
          self.pixels[i] = self.foodColor
        elif i in self.body:
          self.pixels[i] = (0, 255, 0)
        else:
          self.pixels[i] = (0, 0, 0)  
