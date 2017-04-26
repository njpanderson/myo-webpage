# Events

There’s currently only one event fired by tag, which is detailed below:

Element | Event | Description
--- | --- | ---
View container | `tag:update` | Fired after the view updates with new markup. Can be used to (re)instantiate JS events, controllers etc on your template contents.

## Example event use

Any event tag fires can be treated as a normal DOM Event. An example of attaching a listener to the `tag:update` event is as follows:

```
// placed in your template HTML
<script>
var view = document.querySelector('.view');
view.addEventListener('tag:update', function(event) {
	// event code goes here (event.target === view container)
}
</script>
```