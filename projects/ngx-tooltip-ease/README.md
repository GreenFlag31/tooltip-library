# ngx-tooltip-ease

# Description

ngx-tooltip-ease is an Angular library providing a lightweight, performant, and responsive tooltip. This library supports custom and
build-in animations, multiple lines tooltip, and a custom offset space.

Support Angular version starts at v17.

# Demo

Live demonstration of the ngx-tooltip-ease library [here](https://greenflag31.github.io/tooltip-library/ngx-tooltip-ease).

# Installation

You can install the library using the following command:

```
npm i ngx-tooltip-ease
```

Import the stylesheet in your `styles.css`:
`@import "../node_modules/ngx-tooltip-ease/src/lib/tooltip.css";`

Add the `TooltipDirective` to your module or standalone component.

# Usage

This library consists in a directive and its options to add in the template:

```html
<button ngxTooltip content="Hello!" animation="going-down">Ngx-tooltip-ease</button>
```

| Option      | Default          | Description                                                                                                |
| ----------- | ---------------- | ---------------------------------------------------------------------------------------------------------- |
| content     |                  | Set the content of your tooltip. Supports multi-lines tooltip by adding `/n` where you want a line return. |
| disable     | false            | Disable the tooltip. No tooltip will be shown.                                                             |
| position    | top              | Set the position of the tooltip. Accepts: top or bottom.                                                   |
| animation   | scale-up fade-in | Set the keyframes animations. Multiple animations should be separated with a space.                        |
| animationFn | ease-out         | Set the timing function of the animation. Value: 'ease', 'ease-in', 'ease-out', cubic-bezier, ...          |
| animationMs | 200              | Set the duration of the animation in ms.                                                                   |
| offsetSpace | 5                | Define in pixels the offset space between the hosting element and the tooltip.                             |

# Responsive

This library is responsive and will adapt its position based on the available space. If the width of the tooltip is greater than the window width, a truncated tooltip with an ellipsis will appear. Responsiveness comes without attaching a resize event.

# Ready-to-use animations keyframes

This library comes with build-in and ready-to-use animations keyframes to animate the opening menu. Just fill in the `name`, `duration` and `easing function` (more info on the `animation CSS shorthand` [here](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)).

You have the choice for the opening menu animation between no animations, any following build-in animations, or creating your own keyframes.

```css
@keyframes scale-up {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes going-down {
  from {
    transform: translateY(-10%);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes going-up {
  from {
    transform: translateY(10%);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes going-left {
  from {
    transform: translateX(10%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes going-right {
  from {
    transform: translateX(-10%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes scale-up-bottom {
  from {
    transform: scale(0.9);
    transform-origin: bottom;
  }
  to {
    transform: scale(1);
    transform-origin: bottom;
  }
}
@keyframes scale-up-top {
  from {
    transform: scale(0.9);
    transform-origin: top;
  }
  to {
    transform: scale(1);
    transform-origin: top;
  }
}
```

# Style customisation

Instead of changing style through a dedicated API with limited options, this library let the total control over the styling possibilities to the user. (Recommanded) To change default styles, create a new `.css` (or preprocessor) file, and import it in your `styles.css` file at root. The class to override is `ngx-tooltip` attached to a paragraph element.

```css
header p.ngx-tooltip {
  background: #000;
  color: gold;
  font-family: "Allura";
  font-size: 1.1rem;
}
```

# Change log

# Report a Bug

Please provide a detailed description of the encountered bug, including your options and the steps/actions that led to the issue. An accurate description will help me to reproduce the issue.

# Ngx-ease serie

You like this library? Discover the ngx-ease serie [here](https://www.npmjs.com/~greenflag31).
