S3DB File Upload Tool
=====================
This is a tool that allows users to upload files to S3DB instance and it is completely mplemented in JavaScript. Users can log into S3DB with their username and password combinations or user generated api keys. You also have to specify the Item ID and Rule ID combination that you plan to upload the files to in the configuration [see usage below].  

**Version**
1.0.2


**Demo Page**
Demo Page Link [link](http://ebadedude.github.com/S3DB-File-Upload)


**Dependencies**
*	JQuery [link](http://code.jquery.com/jquery-1.7.2.min.js)
*	Twitter Bootstrap [link](http://twitter.github.com/bootstrap/)
*	JQuery File Upload [link](https://github.com/blueimp/jQuery-File-Upload)

 
**Features**
*	File Upload with drag and drop features
*	On the fly connection to S3DB
*	Forgot your API key? automatic API key generation
*	File listing
*	Ability to delete files


**TODO**
*	Remove delete button for files you cannot delete
*	Add waiting gestures (spinner) for processes that can take longer than 2 secs
  

**Usage**
Look at the index.html file to see how things are configured and used. You can connect to some of the JS files remotely and you dont have to use the ones that come with the application.

For every project in S3DB, you have one or more collections. For each collection you can have one or more items and one or more rules. Each file upload is now treated as a statement that belongs to an individual item with the same name as the statement. This way we can make several assertions about each file. To create the file entry we need a collection ID and a rule ID to create.
 
		var data = {
				's3dburl':'specify the S3DB url',
				'collectionid':'CXXX',
				'ruleid':'RXXX',
				'spinnertext':' working...',
			};
		s3dbfu.init(data);

*	s3dburl - url for S3DB instance
*	collectionid - Collection ID for file upload
*	ruleid - Rule ID for file upload
*	spinnertext - Text that you would like to see after the spinner