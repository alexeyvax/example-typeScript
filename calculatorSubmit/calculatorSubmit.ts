/* отправка формы с помощью ajax */

import * as Store from './store';

const CLASS_CURRENT: string = 'current';

function main(): void
{
	const container: HTMLElement = document.querySelector( 'html>body>main>aside.application' ) as HTMLElement;

	if ( !container )
	{
		return;
	}

	const successElement: HTMLElement = container.querySelector( 'div.success' ) as HTMLElement;
	const preloader: HTMLElement = container.querySelector( 'div.loader' ) as HTMLElement;
	const form: HTMLFormElement = container.querySelector( 'form' ) as HTMLFormElement;
	const fieldsCollection: NodeList = form.querySelectorAll( 'li>input, li>textarea' );
	const buttonPrint: HTMLElement = document.querySelector( 
		'main>form.calc-price>ol>li.final-estimate>div.share-final-estimate>button.print' ) as HTMLElement;
	let isAddListeners: boolean = false;
	let isValid: boolean = false;
	const errorElements: Array<HTMLInputElement|HTMLTextAreaElement> = [];
	
	registerHandlers();

	function registerHandlers(): void
	{
		form.addEventListener(
			'submit',
			( event: Event ) =>
			{
				event.preventDefault();
				validateForm( form, successElement, preloader, fieldsCollection );
			}
		);

		buttonPrint.addEventListener( 'click', ( event: Event ) => 
			{
				event.preventDefault();
				regularSendingRequest();
			}
		);
	}
	
	function sortFields( fieldsCollection: NodeList ): void
	{
		errorElements.length = 0;
		
		Array.prototype.filter.call(
			fieldsCollection,
			( item: HTMLInputElement | HTMLTextAreaElement ) =>
			{
				item.classList.remove( 'error' );

				if ( item.value === '' )
				{
					item.classList.add( 'error' );
					errorElements.push( item );
				}
				
				/*if ( item.name === 'email' )
				{
					item.value === ;
				}*/
			}
		);

		if ( errorElements.length === 0 )
		{
			isValid = true;
		}
	}
	
	function validateForm(
		form: HTMLFormElement,
		successElement: HTMLElement,
		preloader: HTMLElement,
		fieldsCollection: NodeList
	): void
	{
		if ( !isAddListeners )
		{
			Array.prototype.forEach.call(
				fieldsCollection,
				( item: HTMLInputElement | HTMLTextAreaElement ) =>
				{
					item.addEventListener( 'keyup', () => sortFields( fieldsCollection ) );
					item.addEventListener( 'change', () => sortFields( fieldsCollection ) );
				}
			);
			
			isAddListeners = true;
		}

		sortFields( fieldsCollection );
		
		if ( isValid )
		{
			ajaxLoad( form, successElement, preloader );
		}
	}
	
	function regularSendingRequest(): void
	{
		const formCreating: HTMLFormElement = document.createElement( 'form' ) as HTMLFormElement;
		
		formCreating.action = form.action;
		formCreating.method = form.method;
		formCreating.target = '_blank';

		formCreating.appendChild( createInputStorage( 'style', JSON.stringify( Store.storeStyle ) ) );
		formCreating.appendChild( createInputStorage( 'styleName', JSON.stringify( Store.storeStylePrice ) ) );
		formCreating.appendChild( createInputStorage( 'parameters', JSON.stringify( Store.storeAreaParameters ) ) );
		formCreating.appendChild( createInputStorage( 'priceParameters', JSON.stringify( Store.priceStoreParameters ) ) );
		formCreating.appendChild( createInputStorage( 'options', JSON.stringify( Store.storeOptions ) ) );
		formCreating.appendChild( createInputStorage( 'optionsWindow', JSON.stringify( Store.storeOptionsWindow ) ) );
		formCreating.appendChild( createInputStorage( 'allPrice', JSON.stringify( Store.storeAllPrice ) ) );
		
		formCreating.style.height = '0';
		formCreating.style.overflow = 'hidden';
		formCreating.style.position = 'absolute';
		formCreating.style.top = '-100%';
		document.body.appendChild( formCreating );
		formCreating.submit();
		document.body.removeChild( formCreating );
	}
	
	function createInputStorage( name: string, store: string ): HTMLInputElement
	{
		const inputCreating: HTMLInputElement = document.createElement( 'input' ) as HTMLInputElement;

		inputCreating.type = 'hidden';
		inputCreating.name = name;
		inputCreating.value = store;
		
		return inputCreating;
	}
	
	function ajaxLoad(
		form: HTMLFormElement, successElement: HTMLElement, preloader: HTMLElement
	): void
	{
		const request: XMLHttpRequest = new XMLHttpRequest();
		const data: FormData = new FormData( form );

		data.append( 'style', JSON.stringify( Store.storeStyle ) );
		data.append( 'styleName', JSON.stringify( Store.storeStylePrice ) );
		
		data.append( 'parameters', JSON.stringify( Store.storeAreaParameters ) );
		data.append( 'priceParameters', JSON.stringify( Store.priceStoreParameters ) );
		
		data.append( 'options', JSON.stringify( Store.storeOptions ) );
		data.append( 'optionsWindow', JSON.stringify( Store.storeOptionsWindow ) );

		data.append( 'allPrice', JSON.stringify( Store.storeAllPrice ) );

		preloader.classList.add( CLASS_CURRENT );
		
		request.open( form.method, form.action, true );
		request.addEventListener( 'load', show );
		request.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );
		request.send( data );
		
		function show(): void
		{
			if ( ( request.readyState === XMLHttpRequest.DONE )
				&& ( request.status === 200 ) )
			{
				form.reset();
				successElement.classList.add( CLASS_CURRENT );
				preloader.classList.remove( CLASS_CURRENT );
				isValid = false;
			}
			else
			{
				alert( 'Сообщение не отправлено, попробуйте снова.');
			}
		}
	}
}

export {
	main as default,
};
