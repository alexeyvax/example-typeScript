/* плавающая шапка */

import StickyHeader from '../classes/StickyHeader'

function main(): void
{
	const movingHat: HTMLElement = document.querySelector( 'body>header.moving-hat' ) as HTMLElement;
	
	if ( !movingHat )
	{
		return;
	}
	
	new StickyHeader( movingHat );
}

export {
	main as default,
}