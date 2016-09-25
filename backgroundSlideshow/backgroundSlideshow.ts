/** Фоновый слайдер */

import BackgroundSlideshow from '../classes/BackgroundSlideshow';

export default function(): void
{
	/** @type {HTMLElement} Пашка микросайта */
	let header: HTMLElement;
	let slideshowContainer: HTMLElement;
	let slidesCollection: HTMLCollection;
	let timeout: number;
	
	header = <HTMLElement>document.querySelector( 'body>header.microsite' );
	
	if ( !header )
	{
		return;
	}
	
	slideshowContainer = <HTMLElement>document.querySelector( 'div.background-slideshow' );
	
	if ( !slideshowContainer )
	{
		return;
	}
	
	slidesCollection = <HTMLCollection>slideshowContainer.querySelectorAll( 'ul.slides>li' );
	
	if ( !slidesCollection[0] )
	{
		return;
	}

	timeout = Number( slideshowContainer.dataset['timeout'] ) | 10000;
	new BackgroundSlideshow( slidesCollection, timeout );
}
