# ncMapDraw - Beta 0.1
# This is a test program, I am trying to see if I can adapt it to my
# Nexus Clash mapping project, anyways I lifted it from here:
# https://stackoverflow.com/questions/19586828/drawing-grid-pattern-in-matplotlib
# I have borrowed the coordinate encode/decode system from the NC hypermap
# which I happen to be the curator of currently
#
# Onward to the show!
#
# Optimal settings for hi-res:
# figsize=(16.81, 16.81)
# dpi=1000
#
#############
##  GOALS  ##
#############
# [X] - Load csv file and aqcuire data
# [X] - Assemble data array where physical location stores the encoded coordinate data
# [X] - Store hex color in that space of the color map
# [X] - print map to file
# [] - Take outer planes into consideration
import csv
import math
import matplotlib.colors
import matplotlib.pyplot as plt
import numpy as np
import sys
np.set_printoptions(threshold=sys.maxsize)
my_dpi = 96.0

def encodeLocation(x, y, plane):
    """Takes a tuple of coordinates (x, y, z) and returns a unique identifier"""
    val = x + y*50 + plane*2500
    return int(val)

def decodeLocation(val):
    """Returns a tuple that the initial coordinate was (x, y, z)"""
    result = [np.nan] * 3
    result[2] = math.floor(val/2500)
    result[1] = math.floor((val - result[2]*2500)/50)
    result[0] = math.floor((val - result[1]*50)%50)
    return result

def loadData():
    """Loads external data into a list of tuples holding coord and color data"""
    rawData = []
    with open('mapdata.csv', newline='') as f:
        reader = csv.reader(f)
        for row in reader:
            rawData.append(row)
    return rawData

# map size (N x N)
N = 70

# main list of decoded coordinates
# the encoded location will store the color
# ie - location (1,2,0) has a color of #FF00BB
# main[101] = '#FF00BB'
mainCoords = list(range(0, 12000))
mainColors = ['w'] * 12000

# make an empty data set
map = np.ones((N, N)) * np.nan

# The start of data seperation
rawData = loadData()
for coord in rawData:
    x = int(coord[0])
    y = int(coord[1])
    planeText = coord[2]
    print(planeText)
    if planeText == ' Laurentia':
        plane = 0
    color = str.strip(coord[3])
    print(color)
    xAdj = x - 1
    yAdj = y - 1
    encodedCoord = encodeLocation(x, y, plane)
    decodedCoord = decodeLocation(encodedCoord)
    map[yAdj][xAdj] = encodedCoord
    mainColors[encodedCoord] = color
    print('x: ' + str(x) + ' y: ' + str(y) + ' Encoded: ' + str(encodedCoord) + ' Decoded: ' + str(decodedCoord) + ' Color: ' + color)
    print('map[' + str(yAdj) + '][' + str(xAdj) + ']')
    print(map[yAdj][xAdj])

# DEBUGGING STUFF
#print('current map')
#print(map)
#print(mainColors)
#print(map)
#print(mainColors)
print('19, 32 encoded: ' + str(map[33][20]))
print('Should be map[33][20]')
print(mainColors[int(map[33][20])])
print(decodeLocation(int(map[33][20])))
print(map[30][16])
print(decodeLocation(map[30][16]))
print(mainColors[int(map[30][16])])
print(mainColors)
# make a figure + axes
#fig, ax = plt.subplots(1, 1, tight_layout=True, figsize=(19,19))
fig, ax = plt.subplots(1, 1, tight_layout=True, figsize=(40,40))

# make color map
my_cmap = matplotlib.colors.ListedColormap(mainColors)
norm = matplotlib.colors.BoundaryNorm(mainCoords, my_cmap.N)

# set the 'bad' values (nan) to be black
my_cmap.set_bad(color='w')

# draw the grid as black lines:'k' or white lines:'w'
for x in range(N + 1):
    ax.axhline(x, lw=my_dpi/(1024*32), color='k', zorder=5)
    ax.axvline(x, lw=my_dpi/(1024*32), color='k', zorder=5)

# draw the boxes
ax.imshow(map, interpolation='none', cmap=my_cmap, norm=norm, extent=[0, N, 0, N], zorder=0)

# turn off the axis labels
ax.axis('off')

# Output png
plt.savefig('valhalla.png', dpi=my_dpi)
