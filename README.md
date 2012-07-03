S3DB File Upload Tool
=====================
This is a tool that allows users to upload files to S3DB instance and it is completely mplemented in JavaScript. Users can log into S3DB with their username and password combinations or user generated api keys. You also have to specify the Item ID and Rule ID combination that you plan to upload the files to in the configuration [see usage below].  


**Version**
1.0.1


**Dependencies**
*	JQuery [link](http://code.jquery.com/jquery-1.7.2.min.js)
*	Twitter Bootstrap [link](http://twitter.github.com/bootstrap/)
*	JQuery File Upload [link](https://github.com/blueimp/jQuery-File-Upload)

 
**Features**
*	File Upload with drag and drop features
*	On the fly connection to S3DB
*	Forgot your API key? automaticAPI key generation
*	File listing
*	Ability to delete files


**TODO**
*	Remove delete button for files you cannot delete
*	Add waiting gestures (spinner) for processes that can take longer than 2 secs
  

**Usage**
Look at the index.html file to see how things are configured and used. You can connect to some of the JS files remotely and you dont have to use the ones that come with the application.

For every project in S3DB, you have one or more collections. For each collection you can have one or more items and one or more rules. Each file upload is treated as a statement which requires an item ID and a rule ID to create.
 
	<blockquote>
		var data = {
				's3dburl':'specify the S3DB url',
				'itemid':'IXXX',
				'ruleid':'RXXX',
				'spinnertext':' working...',
			};
		s3dbfu.init(data);
	</blockquote>

*	s3dburl - url for S3DB instance
*	itemid - Item ID for file upload
*	ruleid - Rule ID for file upload
*	spinnertext - Text that you would like to see after the spinner