# ncMapDraw - Beta 0.1
# This is a test program, I am trying to see if I can adapt it to my
# Nexus Clash mapping project, anyways I lifted it from here:
# https://stackoverflow.com/questions/19586828/drawing-grid-pattern-in-matplotlib
# I have borrowed the coordinate encode/decode system from the NC hypermap
# which I happen to be the curator of currently
#
# Onward to the show!
#
#
#############
##  GOALS  ##
#############
# [] - Load csv file and aqcuire data
# [] - Assemble data array where physical location stores the encoded coordinate data
# [] - Store hex color in that space of the color map
# [] - print map to file
# [] - Take outer planes into consideration
import math
import matplotlib.colors
import matplotlib.pyplot as plt
import numpy as np

def encodeLocation(x, y, plane):
    """Takes a tuple of coordinates (x, y, z) and returns a unique identifier"""
    val = x + y*50 + plane*2500
    return val

def decodeLocation(val):
    """Returns a tuple that the initial coordinate was (x, y, z)"""
    result = [None] * len(2)
    result[2] = math.floor(val/2500)
    result[1] = math.floor((val - result[2]*2500)/50)
    result[0] = math.floor((val - result[1]*50)%50)
    return result


# map size (N x N)
N = 70

# main list of decoded coordinates
# the encoded location will store the color
# ie - location (1,2,0) has a color of #FF00BB
# main[101] = '#FF00BB'
main = [None] * 12000

# make an empty data set
data = np.ones((N, N)) * np.nan

# make a figure + axes
fig, ax = plt.subplots(1, 1, tight_layout=True)

# make color map
my_cmap = matplotlib.colors.ListedColormap(['r', 'g', 'b'])

# set the 'bad' values (nan) to be black
my_cmap.set_bad(color='k')

# draw the grid as black lines:'k' or white lines:'w'
for x in range(N + 1):
    ax.axhline(x, lw=2, color='k', zorder=5)
    ax.axvline(x, lw=2, color='k', zorder=5)

# draw the boxes
ax.imshow(data, interpolation='none', cmap=my_cmap, extent=[0, N, 0, N], zorder=0)

# turn off the axis labels
ax.axis('off')

# Output png
plt.savefig('valhalla.png')
