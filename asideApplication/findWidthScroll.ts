/**
 * Поиск ширины скролла
 */

let scrollBarWidth: number;

/**
 * Функция которая определяет ширину полосы прокрутки браузера
 */
function main(): number
{
	let findScroll: HTMLElement;
	
	if ( scrollBarWidth )
	{
		return scrollBarWidth;
	}
	
	findScroll = document.createElement( 'div' );
	
	findScroll.style.overflowY = 'scroll';
	findScroll.style.width = '50px';
	findScroll.style.height = '50px';
	
	findScroll.style.visibility = 'hidden';
	
	document.body.appendChild( findScroll );
	scrollBarWidth = findScroll.offsetWidth - findScroll.clientWidth;
	document.body.removeChild( findScroll );
	
	return scrollBarWidth;
}

export {
	main as default,
};
