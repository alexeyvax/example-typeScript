/**
 * Класс для фонового слайдшоу
 */

/**
 * Нижняя граница для размера экрана "маленький"
 * @type {number}
 */
const SCREEN_WIDTH_MOBILE_MODE: number = 980;
/**
 * Класс активности лайтбокса
 * @type {string}
 * @const
 */
const CLASS_CURRENT: string = 'current';
/**
 * Класс следующего слайда
 * @type {string}
 * @const
 */
const CLASS_NEXT: string = 'next';
/**
 * Класс предыдущего слайда
 * @type {string}
 * @const
 */
const CLASS_PREV: string = 'prev';

export default class BackgroundSlideshow
{
	private body: HTMLElement;
	/** Коллекция слайдов */
	private slidesCollection: HTMLCollection;
	/** Текущий индекс */
	private currentIndex: number;
	/** Следующий индекс */
	private nextIndex: number;
	/** Предыдущий индекс */
	private prevIndex: number;
	/** Таймер */
	private timer: number;
	/** Состояние работы автолистания */
	private played: boolean;
	/** Заданная скорость переключения слайдов */
	private timeout: number;
	
	public constructor( slidesCollection: HTMLCollection, timeout: number )
	{
		this.body = document.body;
		this.slidesCollection = slidesCollection;
		this.currentIndex = 0;
		this.nextIndex = 1;
		this.timeout = timeout;
		this.slidesCollection[this.currentIndex].classList.add( CLASS_CURRENT );
		
		if ( this.slidesCollection.length > 1 )
		{
			this.slidesCollection[this.nextIndex].classList.add( CLASS_NEXT );
		}

		/*if ( this.slidesCollection.length >= 3 )
		{
			this.slidesCollection[this.prevIndex].classList.add( CLASS_PREV );
		}*/
		
		this.played = true;
		
		window.addEventListener( 'load', () => this.play() );
		window.addEventListener( 'resize', () => this.stop() );
	}

	/** Запуск слайдера */
	private play(): void
	{
		if ( this.isMobileMode()
		|| !this.body.classList.contains( 'index' ) )
		{
			this.stop();
		}
			else if ( this.slidesCollection.length <= 1 )
		{
			clearTimeout( this.timer );
			this.played = false;
			return;
		}
		else
		{
			setTimeout( () =>
			{
				this.nextSlide();
				this.timer = setTimeout( () => this.play(), this.timeout );
			}, this.timeout);
		}
	}

	/** Остановка слайдера */
	private stop(): void
	{
		if ( this.isMobileMode() )
		{
			clearTimeout( this.timer );
			this.played = false;
		}
		else if ( !this.isMobileMode()
			&& !this.played
			&& this.body.classList.contains( 'index' ) )
		{
			this.play();
			this.played = true;
		}
	}

	/** Переключение на следующий слайд */
	private nextSlide(): void
	{
		if ( typeof this.prevIndex === 'undefined' )
		{
			this.prevIndex = this.slidesCollection.length - 1;
			
			this.slidesCollection[this.prevIndex].classList.add( CLASS_PREV );
		}
		
		this.slidesCollection[this.prevIndex].classList.remove( CLASS_PREV );
		this.slidesCollection[this.currentIndex].classList.remove( CLASS_CURRENT );
		this.slidesCollection[this.nextIndex].classList.remove( CLASS_NEXT );
		this.currentIndex++;
		this.nextIndex++;
		this.prevIndex++;
		
		if ( this.currentIndex >= this.slidesCollection.length )
		{
			this.currentIndex = 0;
		}

		if ( this.nextIndex >= this.slidesCollection.length )
		{
			this.nextIndex = 0;
		}

		if ( this.prevIndex >= this.slidesCollection.length )
		{
			this.prevIndex = 0;
		}
		
		this.slidesCollection[this.currentIndex].classList.add( CLASS_CURRENT );
		this.slidesCollection[this.nextIndex].classList.add( CLASS_NEXT );
		
		this.slidesCollection[this.prevIndex].classList.add( CLASS_PREV );
	}
	
	/**
	 * Проверка, является ли разрешение мобильным
	 * @returns {boolean}
	 */
	private isMobileMode(): boolean
	{
		return window.innerWidth <= SCREEN_WIDTH_MOBILE_MODE;
	}
}
