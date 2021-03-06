# script to generate json setting files for all available assets

import os
import sys
import random
import json

cwd = os.getcwd()

settingsFolder = cwd + "/settings"
if not os.path.exists(settingsFolder):
    os.makedirs(settingsFolder);

# use the folders in the images folder to figure out what assets are available
imagesFolder = cwd + "/images"
for currentGame in os.listdir(imagesFolder):

    gameImagesFolder = imagesFolder + "/" + currentGame
    # check that we are in a folder 
    if not os.path.isdir(gameImagesFolder):
        continue

    settings = {}
    settings['assetsDirectory'] = currentGame

    # set up image settings for current game
    images = []
    for image in os.listdir(gameImagesFolder):
        imageName = image[:-4]

        if image == 'pop.png':
            settings['popImage'] = imageName
            settings['popLifeSpan'] = 800
        elif image == 'background.png':
            settings['background'] = imageName
        elif image == 'backbutton.png':
            settings['backButton'] = imageName
        elif image == 'playbutton.png':
            settings['playButton'] = imageName
        elif image == 'reward.png':
            settings['rewardImage'] = imageName
        elif image == 'player.png':
            settings['playerImage'] = imageName
        elif image == 'life.png':
            settings['lifeImage'] = imageName
        else:
            images.append(imageName)

    settings['images'] = images

    # choose a random image to be the goal image
    index = random.randint(0, len(images) - 1)
    settings['goalImage'] = images[index]
    settings['goalImageProbability'] = 0.4
    images.pop(index)

    # set up sound settings for current game
    gameSoundsFolder = cwd + "/sounds/" + currentGame
    if not os.path.exists(gameSoundsFolder):
       print "sounds folder for " + currentGame + " does not exists"
       sys.exit()

    for sound in os.listdir(gameSoundsFolder):
        soundName = sound[:-4]

        if sound == 'pop.mp3':
            settings['popSound'] = soundName
        elif sound == 'win.mp3':
            settings['winSound'] = soundName
        elif sound == 'gameover.mp3':
            settings['gameOverSound'] = soundName

    # use the goal image to find the goal sound file
    settings["goalSound"] = settings["goalImage"]

    # setup rest of settings
    settings["goal"] = 5
    settings["lives"] = 3
    settings["delay"] = 1500
    settings["velocity"] = 100     

    settingsFilePath = settingsFolder + '/' + currentGame + '.json'
    file = open(settingsFilePath, 'w')
    file.write(json.dumps(settings, indent=4, sort_keys=True))
