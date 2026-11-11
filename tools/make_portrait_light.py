"""Build the light-theme density map from the dark-theme one.

On a light page the particles are dark ink, so tones must be inverted: hair,
beard, brows, eyes and clothes get dense particles, lit skin stays sparse.

usage: python3 make_portrait_light.py public/portrait-density.png public/portrait-density-light.png
"""
import sys, numpy as np, cv2
from scipy import ndimage as ndi

src, dst = sys.argv[1], sys.argv[2]
d = cv2.imread(src, cv2.IMREAD_GRAYSCALE).astype(np.float32) / 255
S = d.shape[0]

# silhouette: the white halo encloses the subject. The halo runs off the bottom
# edge, so close it there, then everything not reachable from the top-left
# corner is the subject.
m = d > 0.22
m = ndi.binary_closing(m, iterations=5)
w = m.copy()
w[-1, :] = True
w[int(S * 0.8):, :12] = True      # the shoulder lines stop a few pixels short of the edge
w[int(S * 0.8):, -12:] = True
lbl_o, _ = ndi.label(~w)
m = lbl_o != lbl_o[0, 0]
m = ndi.binary_opening(m, iterations=2)
lbl, n = ndi.label(m)
if n > 1:
    sizes = ndi.sum(m, lbl, range(1, n + 1)); m = lbl == (1 + int(np.argmax(sizes)))
mf = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.6)

# tone, inverted: dark in the photo -> dense ink
tone = 1 - cv2.GaussianBlur(d, (0, 0), 0.8)
tone = np.clip((tone - 0.05) / 0.9, 0, 1)

# edges / fine detail (hair strands, eyelids, beard edge, collar)
g1 = cv2.GaussianBlur(d, (0, 0), 0.9)
g2 = cv2.GaussianBlur(d, (0, 0), 2.4)
dog = np.abs(g1 - g2)
edges = np.clip(dog * 5.0, 0, 1)

# outline of the silhouette
er = ndi.binary_erosion(m, iterations=3, border_value=1)
rim = np.clip(mf - cv2.GaussianBlur(er.astype(np.float32), (0, 0), 1.5), 0, 1)

yy = np.mgrid[0:S, 0:S][0].astype(np.float32) / S
def smooth(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)

cloth = smooth(0.69, 0.80, yy)                  # below the beard
vanish = 1 - smooth(0.72, 0.94, yy)             # dissolve at the bottom edge
shade = 1 - 0.62 * cloth                        # clothes stay lighter than hair and beard

dens = mf * (0.08 + 0.80 * tone ** 1.15) * shade + edges * mf * (0.65 - 0.3 * cloth) + rim * 0.55 * (1 - 0.5 * cloth)
dens *= vanish
face = (yy < 0.6) & m
dens = np.clip(dens / np.percentile(dens[face], 97), 0, 1)
dens[mf < 0.02] = 0
cv2.imwrite(dst, (dens * 255).astype(np.uint8))

# preview with the same sampling the page uses (density^2)
rng = np.random.default_rng(2)
pts = []
p = dens ** 2 + 0.0
while len(pts) < 22000:
    x, y = rng.integers(0, S, 2)
    if dens[y, x] > 0.05 and rng.random() < p[y, x] + 0.02: pts.append((x, y))
P = 2
out = np.full((S * P, S * P), 245, np.uint8)
for x, y in pts: cv2.circle(out, (int(x * P), int(y * P)), 1, 20, -1)
cv2.imwrite(dst.replace('.png', '-preview.png'), out)
