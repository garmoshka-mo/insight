export const forceSample = false
export default `
---
🔥 style: With React Native, you style your application using JavaScript. All of the
  core components accept a prop named style. The style names and values usually match
  how CSS works on the web, except names are written using camel casing, e.g. backgroundColor
  rather than background-color.
ScrollView:
  _: => 💆‍♀️️ Component that wraps platform ScrollView while providing integration
    with touch locking "responder" system.
  🔥 ScrollView renders all: its react child components at once, but this has a performance
    downside.
  🔥 KEEP IN MIND: "that ScrollViews must have a bounded height in order to
    work, since they contain unbounded-height children into a bounded container (via
    a scroll interaction). In order to bound the height of a ScrollView, either set
    the height of the view directly (discouraged) or make sure all parent views have
    bounded height. Forgetting to transfer {flex: 1} down the view stack can lead
    to errors here, which the element inspector makes quick to debug."
  ❔ Props:
    StickyHeaderComponent:
      _: to render sticky headers
      __: A React Component that will be used to render sticky headers, should be
        used together with stickyHeaderIndices. You may need to set this component
        if your sticky header uses custom transforms, for example, when you want your
        list to have an animated and hidable header. If component have not been provided,
        the default ScrollViewStickyHeader component will be used.
    alwaysBounceHorizontal: When true, the scroll view bounces horizontally when it
      reaches the end even if the content is smaller than the scroll view itsel
    disableScrollViewPanResponder: When true, the default JS pan responder on the
      ScrollView is disabled, and full control over touches inside the ScrollView
      is left to its child components. This is particularly useful if snapToInterval
      is enabled, since it does not follow typical touch patterns. Do not use this
      on regular ScrollView use cases without snapToInterval as it may cause unexpected
      touches to occur while scrolling.
TextInput:
  _: for inputting text into the app
  'Props:':
    🔥 autoCapitalize:
      _: ⏩️ Tells TextInput to automatically capitalize certain characters. This property
        is not supported by some keyboard types such as name-phone-pad.
      words: ⏩️ first letter of each word
      sentences: ⏩ first letter of each sentence (default) THE END!
`
