Hooke: figures on springs
==

Hooke is a Javascript library-thing that allows you to lay out figures to the
side of text. The goal is to go from this:

![](http://haldean.org/hooke/before.png)

To this:

![](http://haldean.org/hooke/after.png)

For maximum overkill, I did this using springs (and Hooke's law). While the
transformation seems fairly simple, bringing the figures in the text out-of-line
leads to overlap issues; once the anchor point of each image is fixed to its
location in the text, it's easy to imagine situations in which you could make
images overlap with each other. To get around this overlap, I attach three
springs to each image; one to each of its neighbors, and one to its original
location. I also fix the first and last image in place. I then run a physical
simulation over the spring system until the amount of potential energy present
in the system reaches a certain lower threshold and is maintained at a low value
through multiple timesteps. This keeps the images from laying out over each
other while still keeping them as close to their starting point as possible.

This was definitely made for my writing at [haldean.org](http://haldean.org),
and is married to the layout of those pages (the page on [sous vide][sousvide]
is a good example). To use it, set your body's width to a certain value less
than the width of the screen. The images will be laid out in the right gutter of
the window if there's space for them; if the width of the images would be less
than 300 pixels, then it keeps the images inline. This also means that pages
that use Hooke still look good on phones and tablets.

Note that Hooke, by default, operates on `figure` tags, not `img` tags. This is
for two reasons: one, it makes it easy to associate images and image captions
when doing the layout pass; and two, it makes it easy to specify images that
should stay inline with the text (just use `img` instead of `figure`).

[sousvide]: http://haldean.org/sousvide
