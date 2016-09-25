import findWidthScroll from './findWidthScroll';

const CLASS_CURRENT: string = 'current';
/**
 * Обозначение кнопки esc
 * @type {number}
 * @const
 */
const VK_ESC: number = 27;

const scrollWidth: number = findWidthScroll();

function main(): void
{
	const containerFormCalcPrice: HTMLElement = document.querySelector( 'main>form.calc-price' ) as HTMLElement;
	if ( !containerFormCalcPrice )
	{
		return;
	}

	const asideContainer: HTMLElement = document.querySelector( 'main>aside.application' ) as HTMLElement;
	if ( !asideContainer )
	{
		return;
	}

	const titleLightbox: HTMLElement = document.querySelector( 'form>div.scroll-container>h2' ) as HTMLElement;
	const inputHidden: HTMLInputElement = document.getElementById( 'calculator-input-hidden' ) as HTMLInputElement;
	const buttonOpenCollection: NodeList = containerFormCalcPrice.querySelectorAll(
		'ol>li.final-estimate>div.share-final-estimate>button.mail, ' +
		'ol>li.final-estimate>ul.final-price>li.total>button.application' );

	const buttonClose: HTMLButtonElement = asideContainer.querySelector( 'form>button.close' ) as HTMLButtonElement;

	let unRegisterHandlers: () => void;
	/*const boundDocumentClickHandler: ( event: Event ) => void = ( event ) =>
		documentClickHandler( event, asideContainer, unRegisterHandlers );*/
	const boundDocumentKeyupHandler: ( event: KeyboardEvent ) => void = ( event ) =>
		documentKeyupHandler( event, asideContainer, unRegisterHandlers, inputHidden );

	unRegisterHandlers = (): void =>
	{
		// document.removeEventListener( 'click', boundDocumentClickHandler, true );
		document.removeEventListener( 'keyup', boundDocumentKeyupHandler, true );
	};
	
	registeredHandlers( 
		buttonOpenCollection,
		asideContainer,
		// boundDocumentClickHandler,
		boundDocumentKeyupHandler,
		unRegisterHandlers,
		buttonClose,
		titleLightbox,
		inputHidden
	);
}

function registeredHandlers( 
	buttonOpenCollection: NodeList,
	asideContainer: HTMLElement,
	// boundDocumentClickHandler: ( event: Event ) => void,
	boundDocumentKeyupHandler: ( event: KeyboardEvent ) => void,
	unRegisterHandlers: () => void,
	buttonClose: HTMLButtonElement,
	titleLightbox: HTMLElement,
	inputHidden: HTMLInputElement
): void
{
	Array.prototype.forEach.call(
		buttonOpenCollection,
		( item: HTMLElement ) =>
		{
			item.addEventListener( 'click', ( event: Event ) => show( 
				// event, asideContainer, boundDocumentClickHandler, boundDocumentKeyupHandler ) );
				event, asideContainer, boundDocumentKeyupHandler, item.dataset['hidden'],
				item.dataset['title'], titleLightbox, inputHidden ) );
		}
	);
	
	buttonClose.addEventListener( 'click', () => hide( asideContainer, unRegisterHandlers, inputHidden ) );
}

function show( 
	event: Event,
	asideContainer: HTMLElement,
	// boundDocumentClickHandler: ( event: Event ) => void,
	boundDocumentKeyupHandler: ( event: KeyboardEvent ) => void,
	hidden: string,
	title: string,
	titleLightbox: HTMLElement,
	inputHidden: HTMLInputElement
): void
{
	event.preventDefault();
	asideContainer.classList.add( CLASS_CURRENT );
	document.documentElement.classList.add( 'lightbox' );
	document.documentElement.style.overflow = 'hidden';
	document.documentElement.style.paddingRight = scrollWidth + 'px';
	titleLightbox.textContent = title;
	inputHidden.value = hidden;
	// document.addEventListener( 'click', boundDocumentClickHandler, true );
	document.addEventListener( 'keyup', boundDocumentKeyupHandler, true );
}

function hide( asideContainer: HTMLElement, unRegisterHandlers: () => void, inputHidden: HTMLInputElement )
{
	const successElement: HTMLElement = asideContainer.querySelector( 'form>div.success' ) as HTMLElement;
	
	asideContainer.classList.remove( CLASS_CURRENT );
	
	if ( successElement )
	{
		asideContainer.querySelector( 'form>div.success' ).classList.remove( CLASS_CURRENT );
	}
	
	document.documentElement.classList.remove( 'lightbox' );
	document.documentElement.style.overflow = '';
	document.documentElement.style.paddingRight = '';
	inputHidden.value = '';
	unRegisterHandlers();
}

/** закрытие лайтбокса по клику вне его */
/*function documentClickHandler(
	event: Event,
	asideContainer: HTMLElement,
	unRegisterHandlers: () => void
): void
{
	if ( !asideContainer.querySelector( 'form' ).contains( event.target as HTMLElement ) )
	{
		hide( asideContainer, unRegisterHandlers );
	}
}*/

/** закрытие лайтбокса по клавише esc */
function documentKeyupHandler(
	event: KeyboardEvent,
	asideContainer: HTMLElement,
	unRegisterHandlers: () => void,
	inputHidden: HTMLInputElement
): void
{
	if ( event.keyCode === VK_ESC )
	{
		hide( asideContainer, unRegisterHandlers, inputHidden );
	}
}

export {
	main as default,
}