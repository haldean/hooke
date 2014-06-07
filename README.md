Hooke: figures on springs
==

[See an animated demo here.][svanim]

Hooke is a Javascript library-thing that allows you to lay out figures to the
side of text. This is mostly for aethetic reasons, but it also has the advantage
that it makes text easier to read, since you aren't interrupted by figures;
Hooke enables a style similar to the same way research papers are laid out, with
figures independent to -- and referenced from -- the text. The goal is to go
from this:

<img class="border" src="before.png">

To this:

<img class="border" src="after.png">

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
for a couple reasons: 

1. You can group images and image captions together when doing the layout pass.
2. You can specify images that should stay inline with the text (just use `img`
   instead of `figure`).
3. You can have other things go in the right gutter (code snippets, block
   quotes, you name it).

For a treat, try appending `#animate` to any page running Hooke, and watch the
springs in action, [like so][svanim]. You can [get Hooke from Github][github];
it's just one file to include in your HTML that needs JQuery to run.

[sousvide]: http://haldean.org/sousvide
[svanim]: http://haldean.org/sousvide/#animate
[github]: https://github.com/haldean/hooke

<style>
.border {
	border: 0.2em solid #eee;
	margin-left: -1.7em;
	margin-top: 1.5em;
	margin-bottom: 1.5em;
}
</style>
