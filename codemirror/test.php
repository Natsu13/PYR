<link rel="stylesheet" href="./base16-dark.css">
<link rel="stylesheet" href="./codemirror.css">
<script src="./codemirror.js"></script>
<script src="./python/python.js"></script>
<script src="./addon/selection/active-line.js"></script>
<script src="./addon/edit/matchbrackets.js"></script>
<textarea id="code" name="code" style="width:100%;height:100%;background-color:black;"></textarea>
<style>
.CodeMirror {
  border: 1px solid #eee;
  width: 500px;
  hegight: 300px;
}
</style>
<script>
	var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
		lineNumbers: true,
		styleActiveLine: true,
		matchBrackets: true,
		theme: "base16-dark"
	  });
	  </script>