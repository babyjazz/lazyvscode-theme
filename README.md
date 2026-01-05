# LazyVscode Theme 🎨
A smooth and fancy Visual Studio Code theme with beautiful UI elements and smooth transitions.

## Features ✨

- Fancy, smooth, and beautiful UI inspired by LazyVim [screenshot coming soon]
- Comic Sans as the default font for a unique coding experience [screenshot coming soon]
- Enable/disable beautiful shadow effect [screenshot coming soon]
- Fun pets: A bulging eyes cow [screenshot coming soon]
- Snow effect for a festive look [screenshot coming soon]
- Animated cursor trail [screenshot coming soon]
- Smooth cursor animation with customizable speed and easing [screenshot coming soon]
- Follow-cursor effect [screenshot coming soon]

## Screenshots

[screenshot coming soon]

## Installation 🚀

```bash
ext install lazyvscode-theme
```

Or install through the [VS Code Marketplace](https://marketplace.visualstudio.com/vscode) or [Open VSX Registry](https://open-vsx.org/extension/babyjazz/lazyvscode-theme).

## ⚠️ Prerequisite: Custom CSS and JS Loader

This extension requires the [Custom CSS and JS Loader](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css) extension to be installed and enabled in your VS Code. Please follow the instructions on the [marketplace page](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css) to set it up.


## Customization & Settings 🛠️

You can customize the theme and effects using the following settings in your `settings.json`:

```json
{
    // Enable or disable the follow-cursor feature
    "babyjazz.follow-cursor": true,

    // Speed of the follow-cursor animation (ms)
    "babyjazz.follow-cursor-speed": 15,

    // Enable or disable the snow effect
    "babyjazz.is-enable-snow": false,

    // Enable or disable the cursor trail effect
    "babyjazz.is-enable-cursor-trail": false,

    // Duration of the cursor trail effect (ms)
    "babyjazz.cursor-trail-duration": 1500,

    // Enable or disable the pet: A BULGING EYES COW
    "babyjazz.is-enable-pet-a-bulging-eyes-cow": false,

    // Duration of the cursor smooth animation (ms)
    "babyjazz.cursor-smooth-duration": 150,

    // Easing function for cursor smooth animation
    "babyjazz.cursor-smooth-easing": "ease-out"
}
```

**Font Customization:**

The extension will automatically read `editor.fontFamily`, `editor.fontWeight`, `terminal.integrated.fontFamily`, and `terminal.integrated.fontWeight` from your `settings.json`. You can set these as you wish to override the defaults (such as Comic Sans):

```json
{
    "editor.fontFamily": "JetBrains Mono",
    "editor.fontWeight": "500",
    "terminal.integrated.fontFamily": "JetBrains Mono",
    "terminal.integrated.fontWeight": "500"
}
```

## Support in
- MacOS
- Windows

> ## ⚠️ **Tested on VSCode only**
> **This extension is fully supported only on the VSCode application.**
> **Some features may not work as expected in forked VSCode repo such as Cursor.**

<sub>I planed to test and fix bugs in other forked VSCode repo in the future.</sub>

## Contributing 🤝

Issues and PRs are always welcome!

## License 📝
MIT

Made with ❤️ by babyjazz

⭐ If you like this theme, don't forget to rate it!