{% for (var i=0, file; file=o.files[i]; i++) { %}
	<tr class="template-download fade">
	{% if (file.error) { %}
		<td></td>
		<td class="name"><span>{%=file.file_name%}</span></td>
		<td class="size"><span>{%=o.formatFileSize(parseInt(file.file_size))%}</span></td>
		<td class="error" colspan="2"><span class="label label-important">{%=locale.fileupload.error%}</span> {%=locale.fileupload.errors[file.error] || file.error%}</td>
	{% } else { %}
		<td class="preview"></td>
		<td class="name">
		{% if (file.download_url == '#') { %}
			{%=file.value%}
		{% } else { %}
			<a href="{%=file.download_url%}" title="{%=file.file_name%}" download="{%=file.file_name%}" target="_blank">{%=file.file_name%}</a>
		{% } %}
		</td>
		<td class="size"><span>{%=o.formatFileSize(isNaN(parseInt(file.file_size))?'':parseInt(file.file_size))%}</span></td>
		<td colspan="2"></td>
	{% } %}
		<td class="delete">
			<button class="btn btn-danger" data-type="DELETE" data-url="http://{%=s3dbfu.s3dburl()%}/multiupload.php?key={%=s3dbfu.apikey%}&statement_id=S{%=file.statement_id%}">
				<i class="icon-trash icon-white"></i>
				<span>{%=locale.fileupload.destroy%}</span>
			</button>
		</td>
	</tr>
{% } %}
