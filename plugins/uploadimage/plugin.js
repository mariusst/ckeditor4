﻿/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'uploadimage', {
	requires: 'clipboard',
	lang: 'en', // %REMOVE_LINE_CORE%
	init: function( editor ) {
		editor.on( 'paste', function( evt ) {
			var data = evt.data,
				dataTransfer = data.dataTransfer,
				filesCount = dataTransfer.getFilesCount();

			if ( data.dataValue || !filesCount ) {
				return;
			}

			var loadedFilesCount = 0,
				file, reader, i;

			evt.cancel();

			dataTransfer.cacheData();

			for ( i = 0; i < filesCount; i++ ) {
				file = dataTransfer.getFile( i ),
				reader = new FileReader();

				reader.onload = function( evt ) {
					var img = new CKEDITOR.dom.element( 'img' );
					img.setAttributes( {
						'src': evt.target.result,
						'data-cke-special-image': 1
					} );
					data.dataValue += img.getOuterHtml();

					loadedFilesCount++;

					if ( loadedFilesCount == filesCount ) {
						editor.fire( 'paste', data );
					}
				};

				reader.readAsDataURL( file );
			}
		} );

		editor.on( 'paste', function( evt ) {
			var data = evt.data,
				dataTransfer = data.dataTransfer;

			var file = dataTransfer.getFile( 0 );

			var xhr = new XMLHttpRequest();

			var formData = new FormData();
			formData.append( 'upload', file );

			xhr.open( "POST", editor.config.filebrowserImageUploadUrl, true ); // method, url, async

			xhr.onreadystatechange = function() {
				if ( xhr.readyState == 4 ) { // completed
					if ( xhr.status == 200 ) { // OK
						console.log( 'onreadystatechange:' );
						console.log( xhr.responseText );
					}
				}
			}

			xhr.send( formData );
		} );
	}
} );
