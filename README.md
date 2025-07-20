<h1>clawjs</h1>
<h3>VIM-like browser extension.</h3>

Inspired by [Tridactyl](https://github.com/tridactyl/tridactyl/), but actually works in every browser you throw it at.

![image](https://github.com/Nuboctane/clawjs/assets/72999487/1250d71e-c176-4a8b-b76d-515f95b7801a)

Works in (as far as I'm concerned) any browser, this can easily be put into a local browser extension,
you can make a browser extension locally and just use this code and unpack it in your browser's extension library.

If you don't know how to make a browser extension I recommend installing one of the following existing browser extensions to help you use my code.
Such as:

[Code Injector](https://addons.mozilla.org/en-US/firefox/addon/codeinjector/),
[Tampermonkey](https://www.tampermonkey.net/),
[(chrome) Pagemanipulator](https://chromewebstore.google.com/detail/page-manipulator/mdhellggnoabbnnchkeniomkpghbekko?hl=en/)

These extensions should guide you on how to do what you want with my code.

You can always also just paste this code in your browsers console for a one-time run.

<h2>whats different?</h2>

- Scrolling automatically keeps updating the positions of the layered frames.
- The script is activated more respectfully by pressing G and H simultaneously, as opposed to just pressing F in Tridactyl.
- The script uses keys that are easier in finger reach range of mostly all keyboard layouts from 25% and above.
- The script automatically keeps track of the buttons/elements currently in-frame and ignores other ones respectfully, updates when scrolling.
- The script makes use of less cryptic key tags when activated, read more about this below on how to use them.
  
<h2>how to use</h2>
Press SHIFT and ALT simultaneously to activate the frames on top of interactable elements.

Press SHIFT and ALT  simultaneously again to disable the frames.

After enabling the frames, key tags are shown in the corner of each frame indicating which key you will have to press to interact with this element.
When the key you want is pressed, all frames that did not have this key will disappear and the elements that remain will show new keys.
this way you can narrow down quickly which element you want to interact with. Once there are no more combinations left, the element will be selected.

<h2>known issues/TODO</h2>

- Elements that can be scrolled within themselves could show key labels not directly visible to the client on activation.

<h2>issues with workarounds</h2>

- Event listeners of the page you're visiting might intervene with this script when/before activated.

i have not yet found a way to optimally avoid keyboard keys the DOM is already using, for now you can change your initialize settings on the bottom of claw.js

example initialize settings:

```js
const claw = new ClawOverlay({
    keys: "QWERTYUIOPASDFGHJKLZXCVBNM".split(''), // Available keys for overlay selection
    refreshTimeout: 500, // Milliseconds between overlay refreshes
    toggleKeys: ['SHIFT', 'ALT'] // Press SHIFT + ALT to toggle overlays
});
```

Available keys:
QWERTYUIOPASDFGHJKLZXCVBNM1234567890

Available modifiers:
SHIFT, ALT, CONTROL and META (windows key)

you can also use multiple or less toggle keys in order to trigger the overlay

```js
    toggleKeys: ['F', 'G', 'H'] // Press F + G + H to toggle overlays
```

or

```js
    toggleKeys: ['F']  // Press just F to toggle overlays
```

want to use even less keys when navigating through the overlay?

try:

```js
const claw = new ClawOverlay({
    keys: "ASD".split(''), // Available keys for overlay selection
    refreshTimeout: 500, // Milliseconds between overlay refreshes
    toggleKeys: ['SHIFT', 'ALT'] // Press SHIFT + ALT to toggle overlays
});
```

this way there will only be boxes labeled with A, S and D. Allowing you to narrow down the element you want to select by using only these 3 keys, get creative with it.

<h2>TIPS</h2>

When using tools like [Code Injector](https://addons.mozilla.org/en-US/firefox/addon/codeinjector/) to run my code, you could use the same code with different initialization settings for certain websites you usually visit. This way you can better shape your VIM-like experience while browsing on any website.
