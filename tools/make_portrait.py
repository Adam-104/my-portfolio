"""Turn a head-and-shoulders photo with a plain light background into the
density map used by the particle portrait on the home page.

usage: python3 make_portrait.py photo.jpg public/portrait-density.png
White = many particles, black = none."""
import sys, numpy as np, cv2
from scipy import ndimage as ndi

src, dst = sys.argv[1], sys.argv[2]
SIZE = 480
img = cv2.imread(src); img = cv2.resize(img, (SIZE, SIZE), interpolation=cv2.INTER_AREA)
lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
c = 40
corners = np.concatenate([lab[:c,:c].reshape(-1,3), lab[:c,-c:].reshape(-1,3)])
bg = np.median(corners, axis=0)
dist = np.linalg.norm(lab - bg, axis=2)
dist = cv2.GaussianBlur(dist, (0,0), 2)
mask = dist > 14
mask = ndi.binary_opening(mask, iterations=2)
mask = ndi.binary_closing(mask, iterations=6)
mask = ndi.binary_fill_holes(mask)
lbl, n = ndi.label(mask)
if n > 1:
    sizes = ndi.sum(mask, lbl, range(1, n+1)); mask = lbl == (1 + int(np.argmax(sizes)))
m = cv2.GaussianBlur(mask.astype(np.float32), (0,0), 2.2)

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
# local contrast so eyes, brows, nose and beard separate from skin
blur = cv2.GaussianBlur(gray, (0,0), 18)
detail = gray - blur
g = np.clip(gray*1.15 + detail*2.6, 0, 1)
g = np.clip((g - 0.10) / 0.62, 0, 1) ** 1.55
yy, xx = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32) / SIZE
light = np.clip(1.2 - 0.5*np.hypot(xx-0.45, yy-0.38), 0.3, 1)
fade = np.clip(1.35 - yy*1.0, 0.0, 1)  # dissolve toward the bottom
rim = np.clip(m - cv2.GaussianBlur(ndi.binary_erosion(mask, iterations=5).astype(np.float32), (0,0), 3), 0, 1)
dens = m * (0.04 + 0.96*g) * light * (0.25 + 0.75*fade) + rim * 0.55 * fade
dens = np.clip(dens / np.percentile(dens[m > 0.5], 97), 0, 1)
cv2.imwrite(dst, (dens*255).astype(np.uint8))

# preview
rng = np.random.default_rng(1)
pts = []
while len(pts) < 16000:
    x, y = rng.integers(0, SIZE, 2)
    if rng.random() < dens[y, x]: pts.append((x, y))
P = 2
out = np.zeros((SIZE*P, SIZE*P), np.uint8)
for x, y in pts: cv2.circle(out, (int(x*P), int(y*P)), 1, 255, -1)
cv2.imwrite(dst.replace('.png', '-preview.png'), out)
