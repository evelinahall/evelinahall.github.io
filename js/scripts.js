document.documentElement.className = document.documentElement.className.replace('no-js', 'js');

const DISCLAIMER = 'Tavlorna säljs utan moms och köpet görs direkt av konstnären (Evelina Häll). Försäljningen av tavlor sker inte genom bolaget Uttrycksfull AB.';

const init = () => {
  const productShow = document.getElementById('product_show');
  const showImageDialog = document.getElementById('image_show');
  const showImageEl = document.getElementById('image_show_el');
  const page = document.getElementById('MainContent');
  const list = document.getElementById('product_list');
  const productTitle = document.getElementById("productTitle");
  const mainImage = document.getElementById("mainImage");
  const img2 = document.getElementById("img2");
  const img3 = document.getElementById("img3");
  const img4 = document.getElementById("img4");
  const img5 = document.getElementById("img5");
  const img6 = document.getElementById("img6");
  const price = document.getElementById("price");
  const description = document.getElementById("description");
  const disclaimer = document.getElementById("disclaimer");
  const buyDisclaimer = document.getElementById("product_buy_disclaimer");
  const artText = document.getElementById("artText");
  const imageShowClose = document.getElementById("image_show_close");
  const buyDialog = document.getElementById("product_buy");
  const buyButton = document.getElementById("buy_button");
  const closeBuyButton = document.getElementById("close_buy_button");
  const buyProductName = document.getElementById("product_buy_product_name");
  const buyProductEmail = document.getElementById("product_buy_email");

  const productById = {};

  Array.from(list.children).forEach(product=>{
    if (!product.attributes.name) {
      return;
    }
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    const img = document.createElement('img');
    const name = product.attributes.name.value;
    img.src = '/img/'+name+'/1_small.jpg';
    div1.appendChild(img);

    div1.className = 'product_image';
    div2.className = 'product_title';
    div2.innerText = product.attributes.title.value;

    product.appendChild(div1);
    product.appendChild(div2);

    productById[name] = product;
  });
  
  const emailAddress = ['.com','ail', 'gm', '@','evelina.hall'].reverse().join('');
  
  const hide = (el) => el.classList.add('hidden');
  const show = (el) => el.classList.remove('hidden');
  const showLF = (el) => el.getAttribute("page") == 'lf' ? show(el) : hide(el);
  const hideLF = (el) => el.getAttribute("page") == 'lf' ? hide(el) : show(el);

  const setSrc = (el, src) => {
    if (src === '') {
      el.style ='display: none';
      el.src = '';
    } else {
      el.style = '';
      el.src = src;
    }
  };

  let lastScroll = -1;

  const updateUi = () => {
    const parts = (window.location.hash || '#').substring(1).split('-').filter(p=>p);

    document.body.classList.remove('overflow-hidden');
    const imageElements = [mainImage, img2, img3, img4, img5, img6];

    if (parts.length >= 1 && productById[parts[0]]) {
      hide(page);
      show(productShow);

      const element = productById[parts[0]];
      const attr = Object.fromEntries(Array.from(element.attributes).map(item => [item.name, item.value]));

      const title = element.children[1].innerText;
      const name = attr.name;
      const images = parseInt(attr.images);
      const isSold = attr.sold === 'true';

      productTitle.innerText = title;
      setSrc(imageElements[0], images >= 1 ? '/img/'+name+'/1_small.jpg' : '');
      setSrc(imageElements[1], images >= 2 ? '/img/'+name+'/2_small.jpg' : '');
      setSrc(imageElements[2], images >= 3 ? '/img/'+name+'/3_small.jpg' : '');
      setSrc(imageElements[3], images >= 4 ? '/img/'+name+'/4_small.jpg' : '');
      setSrc(imageElements[4], images >= 5 ? '/img/'+name+'/5_small.jpg' : '');
      setSrc(imageElements[5], images >= 6 ? '/img/'+name+'/6_small.jpg' : '');
      price.innerText = attr.price + ' kr';
      artText.innerHTML = attr.arttext || '';
      description.innerText = attr.description;
      disclaimer.innerText = DISCLAIMER;
      buyDisclaimer.innerText = DISCLAIMER;

      hide(showImageDialog);
      hide(buyDialog);

      if (isSold) {
        hide(buyButton);
        productShow.classList.add('sold');
      } else {
        show(buyButton);
        productShow.classList.remove('sold');
      }

      if (parts.length == 2) {
        if (parts[1] === 'buy') {
          buyProductName.innerText = title;
          buyProductEmail.href = 'mailto:'+emailAddress+'?subject=Köpförfrågan '+title;
          buyProductEmail.innerText = emailAddress;
          show(buyDialog);
          window.document.title = 'Uttrycksfull - Konst - '+title+ ' - Köp';
        } else {
          const index = parseInt(parts[1]) - 1;
          show(showImageDialog);
          document.body.classList.add('overflow-hidden');
          showImageEl.src = imageElements[index].src.replace('_small', '_large');
          window.scrollTo(0, 0);
          window.document.title = 'Uttrycksfull - Konst - '+title+ ' - '+parts[1];
        }
      } else {
        window.document.title = 'Uttrycksfull - Konst - '+title;
      }
      window.scrollTo(0,0);
    } else {
      imageElements.forEach(el=>el.src='');
      show(page);
      hide(productShow);
      hide(showImageDialog);
      hide(buyDialog);
      window.document.title = 'Uttrycksfull - Konst';

      if (parts.length == 1) {
        if (parts[0] == 'lf') {
          Array.from(list.children).forEach(showLF);
        } else {
          Array.from(list.children).forEach(hideLF);
        }
        var el = document.getElementById(parts[0]);
        if (el && lastScroll == -1) {
          el.scrollIntoView();          
          return;
        }
      }
      window.scrollTo(0,lastScroll);
      lastScroll = -1;
    }
  }

  const setUrl = (hash) => {
    const url = new URL(location);
    if (url.hash !== '#'+hash) {
      url.hash = hash;
      history.pushState({}, "", url);
    }
    updateUi();

    if (gtag && window.location.hostname.includes('uttrycksfull')) {
      gtag('event', 'page_view', {
        page_title: window.document.title,
        page_location: window.location.href
      });
    }
  };

  window.addEventListener("hashchange", updateUi);

  window.onkeydown = (e) => {
    if (e.key === "Escape" && window.location.hash) {
      const parts = window.location.hash.split('-');
      if (parts.length == 2) {
        setUrl(parts[0]);
      } else {
        setUrl('');
      }
    }
  };

  const showImage = (i) => () => {
    setUrl(window.location.hash.split('-')[0]+'-'+i);
  };

  const hideImage = (e) => {
    history.back();
    e.stopPropagation();
  };

  image_show_close.onclick = hideImage;
  showImageDialog.onclick = hideImage;
  buyButton.onclick = () => {
    const parts = window.location.hash.split('-');
    setUrl(parts[0]+'-buy');
  };
  closeBuyButton.onclick = () => {
    history.back();
  };

  mainImage.onclick = showImage(1);
  img2.onclick = showImage(2);
  img3.onclick = showImage(3);
  img4.onclick = showImage(4);
  img5.onclick = showImage(5);
  img6.onclick = showImage(6);

  const showProduct = (element) => {
    lastScroll = window.scrollY;
    setUrl(element.attributes.name.value);
  };

  list.childNodes.forEach(element => {
    element.onclick = ()=>showProduct(element);
  });

  updateUi();
}


(function() {
  var __sections__ = {};
  (function() {
    for(var i = 0, s = document.getElementById('sections-script').getAttribute('data-sections').split(','); i < s.length; i++)
      __sections__[s[i]] = true;
  })();
  (function() {
  if (!__sections__["header"]) return;
  try {
    
  class StickyHeader extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.header = document.querySelector('.section-header');
      this.headerIsAlwaysSticky = this.getAttribute('data-sticky-type') === 'always' || this.getAttribute('data-sticky-type') === 'reduce-logo-size';
      this.headerBounds = {};

      this.setHeaderHeight();

      window.matchMedia('(max-width: 990px)').addEventListener('change', this.setHeaderHeight.bind(this));

      if (this.headerIsAlwaysSticky) {
        this.header.classList.add('section-header-sticky');
      };

      this.currentScrollTop = 0;
      this.preventReveal = false;
      this.predictiveSearch = this.querySelector('predictive-search');

      this.onScrollHandler = this.onScroll.bind(this);
      this.hideHeaderOnScrollUp = () => this.preventReveal = true;

      this.addEventListener('preventHeaderReveal', this.hideHeaderOnScrollUp);
      window.addEventListener('scroll', this.onScrollHandler, false);

      this.createObserver();
    }

    setHeaderHeight() {
      document.documentElement.style.setProperty('--header-height', `${this.header.offsetHeight}px`);
    }

    disconnectedCallback() {
      this.removeEventListener('preventHeaderReveal', this.hideHeaderOnScrollUp);
      window.removeEventListener('scroll', this.onScrollHandler);
    }

    createObserver() {
      let observer = new IntersectionObserver((entries, observer) => {
        this.headerBounds = entries[0].intersectionRect;
        observer.disconnect();
      });

      observer.observe(this.header);
    }

    onScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (this.predictiveSearch && this.predictiveSearch.isOpen) return;

      if (scrollTop > this.currentScrollTop && scrollTop > this.headerBounds.bottom) {
        this.header.classList.add('scrolled-past-header');
        if (this.preventHide) return;
        requestAnimationFrame(this.hide.bind(this));
      } else if (scrollTop < this.currentScrollTop && scrollTop > this.headerBounds.bottom) {
        this.header.classList.add('scrolled-past-header');
        if (!this.preventReveal) {
          requestAnimationFrame(this.reveal.bind(this));
        } else {
          window.clearTimeout(this.isScrolling);

          this.isScrolling = setTimeout(() => {
            this.preventReveal = false;
          }, 66);

          requestAnimationFrame(this.hide.bind(this));
        }
      } else if (scrollTop <= this.headerBounds.top) {
        this.header.classList.remove('scrolled-past-header');
        requestAnimationFrame(this.reset.bind(this));
      }

      this.currentScrollTop = scrollTop;
    }

    hide() {
      if (this.headerIsAlwaysSticky) return;
      this.header.classList.add('section-header-hidden', 'section-header-sticky');
      this.closeMenuDisclosure();
      this.closeSearchModal();
    }

    reveal() {
      if (this.headerIsAlwaysSticky) return;
      this.header.classList.add('section-header-sticky', 'animate');
      this.header.classList.remove('section-header-hidden');
    }

    reset() {
      if (this.headerIsAlwaysSticky) return;
      this.header.classList.remove('section-header-hidden', 'section-header-sticky', 'animate');
    }

    closeMenuDisclosure() {
      this.disclosures = this.disclosures || this.header.querySelectorAll('header-menu');
      this.disclosures.forEach(disclosure => disclosure.close());
    }

    closeSearchModal() {
      this.searchModal = this.searchModal || this.header.querySelector('details-modal');
      this.searchModal.close(false);
    }
  }

  customElements.define('sticky-header', StickyHeader);

  } catch(e) { console.error(e); }
})();

})();
