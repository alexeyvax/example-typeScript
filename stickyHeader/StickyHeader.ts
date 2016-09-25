/**
 * Закрепление шапки при скролле у микросайтов
 */

/**
 * Класс для body ( главной страницы )
 */
const CLASS_BODY_INDEX: string = 'index';
/**
 * Класс для закрепленной шапки
 */
const CLASS_STICKY: string = 'sticky';
/**
 * Нижняя граница для размера экрана "маленький"
 * @type {number}
 * @const
 */
const SCREEN_WIDTH_SMALL: number = 980;

export default class StickyHeader
{
	private static instances: StickyHeader[] = [];
	private static initialized: boolean = false;
	private element: HTMLElement;
	private offsetTop: number;
	private elementTopOffset: number;
	private pinned: boolean;
	private navMain: HTMLElement;
	
	constructor( element: HTMLElement, offsetTop: number = 0 )
	{
		this.element = element;
		this.offsetTop = offsetTop;
		this.pinned = false;
		this.navMain = <HTMLElement>this.element.querySelector( 'nav.main' );
		
		this.updatePinningState( window.pageYOffset );
		
		StickyHeader.instances.push( this );
		
		if ( !StickyHeader.initialized )
		{
			window.addEventListener( 'scroll', StickyHeader.windowScrollHandler, false );
			StickyHeader.initialized = true;
		}
	}
	/**
	 * Функция закрепления шапки
	 */
	public pin(): void
	{
		if ( this.pinned )
		{
			this.element.classList.add( CLASS_STICKY );
			this.pinned = true;
			window.dispatchEvent( new CustomEvent( 'resize' ) );
		}
	}
	/**
	 * Функция открепления шапки
	 */
	public unPin(): void
	{
		if ( !this.pinned )
		{
			this.element.classList.remove( CLASS_STICKY );
			this.pinned = false;
			window.dispatchEvent( new CustomEvent( 'resize' ) );
		}
	}
	/**
	 * Функция определяющая состояние шапки ( откреплена или закреплена )
	 */
	public isPinned(): boolean
	{
		return this.pinned;
	}
	/**
	 * Функция определяющая когда нужно закреплять шапку и когда откреплять её
	 */
	private updatePinningState( scrollY: number ): void
	{
		if ( this.elementTopOffset < scrollY )
		{
			if ( this.pinned )
			{
				return;
			}
			this.pinned = true;
			
			this.pin();
		}
		else if ( this.elementTopOffset > scrollY )
		{
			if ( !this.pinned )
			{
				return;
			}
			
			this.pinned = false;
			
			this.unPin();
		}
	}
	/**
	 * Функция определяющая позицию элемента ( который будет закрепляться ) и сохраняет его в переменную
	 */
	public updateElementTopOffset(): void
	{
		if ( !this.pinned )
		{
			if ( this.isModeMobile()
				&& !document.body.classList.contains( CLASS_BODY_INDEX ) )
			{
				this.elementTopOffset = this.navMain.getBoundingClientRect().top + window.pageYOffset + this.offsetTop;
			}
			else
			{
				this.elementTopOffset = this.element.getBoundingClientRect().bottom + window.pageYOffset + this.offsetTop;
			}
		}
	}
	/**
	 * Функция определяющая состояние шапки при ресайзе окна
	 */
	public windowResizeHandler(): void
	{
		Array.prototype.forEach.call(
			StickyHeader.instances,
			( item: StickyHeader ) =>
			{
				item.updateElementTopOffset();
				item.updatePinningState( window.pageYOffset );
			}
		);
	}
	/**
	 * Функция определяющая состояние шапки при скролле окна
	 */
	private static windowScrollHandler(): void
	{
		Array.prototype.forEach.call(
			StickyHeader.instances,
			( item: StickyHeader ) =>
			{
				item.updatePinningState( window.pageYOffset );
			}
		);
	}
	
	/**
	 * Проверка на мобильный режим
	 * @returns {boolean}
	 */
	private isModeMobile(): boolean
	{
		return ( window.innerWidth < SCREEN_WIDTH_SMALL );
	}
}
