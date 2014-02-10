function ScrollView(element, o) {
    var mView = this,
        mScrollingWrapper,


        STRINGS = {
            vertical: 'vertical',
            fling: 'fling',
            move: 'move',
            pointerdown: 'pointerdown',
            pointermove: 'pointermove',
            pointerup: 'pointerup'
        },

        mTransformName,
        mTransitionName,
        mDirection = (o && o.direction) ? o.direction : STRINGS.vertical,
        mAnimator = new Animator({
            easing: (o && o.easing) ? o.easing : 'easeOutQuad',
            bounds: o ? !!o.bounds : false
        }),

        mCoordProp = (mDirection === STRINGS.vertical) ? 'screenY' : 'screenX',
        mParentProp = (mDirection === STRINGS.vertical) ? 'offsetHeight' : 'offsetWidth',

        mParentWidth,
        mParentHeight,

        mLastPointerCoordinate,

        mTransitionArray = [],
        eventFling;
        mView.mTopOffset = -150;
        mView.X = [];
        mView.Y = [];

    function eventPointerDown(e) {
        console.log('----------------------------------DOWN--------------------------------')
        mView.X.push(e.clientX);
        mView.Y.push(e.clientY);
        mView.beginE = e;
        mView.beginElIndex = e.origin.target.parentNode.getAttribute('data-index');
        if(typeof o.onScrollStart === 'function'){
            o.onScrollStart(e)
        }
        mAnimator.stop();
        mLastPointerCoordinate = e[mCoordProp];
    }

    function eventPointerMove(e) {
        mView.X.push(e.clientX);
        mView.Y.push(e.clientY);
        console.log('------------------------------------MOVE-----------------------------');
        if(e && mView.X.length>=2 && (mView.X[0] !==  mView.X[1]) && e.origin.target.classList.contains(o.swipeTargetClass)){
            if(e.origin.target.parentNode.getAttribute('data-index') !== mView.beginElIndex){
                console.log('-----------------------OTHER---------------------');
//                return;
            }
            mView.swipe = true;
            if(typeof o.onSwipe === 'function'){
                o.onSwipe(e, mView.beginElIndex)
            }
            return;
        }else if(!e.origin.target.classList.contains(o.swipeTargetClass) && mView.swipe){
            if(typeof o.onSwipe === 'function'){
                o.onSwipe(e, mView.beginElIndex)
            }
            return;
        }
        mView.setPosition(mView.scrollPosition - (mLastPointerCoordinate - e[mCoordProp]), null, null, e);
        mLastPointerCoordinate = e[mCoordProp];
    }

    function eventPointerUp(e) {
        console.log('---------------------------------END-----------------------')
        mView.X = [];
        mView.Y = [];
        if(typeof o.onScrollEnd === 'function'){
            o.onScrollEnd(e)
        }
        if(mView.swipe){
            mView.swipe = false;
            return;
        }
        mView.setPosition(mView.scrollPosition - (mLastPointerCoordinate - e[mCoordProp]), true);
        mAnimator.tweakIfNeeded(mView.scrollPosition, mView.setPosition);
    }

    function eventResize() {
        clearTimeout(mView.resizeTimeout);
        mView.resizeTimeout = setTimeout(mView.reflow, 150);
    }

    mView._calculateMaxScroll = function () {
        mView._MaxScroll = mScrollingWrapper[mParentProp] - mView._ParentSize;
    };

    mView.scroll = function (shift, duration) {
        mAnimator.animate(mView.scrollPosition, mView.scrollPosition + shift, duration, mView.setPosition);
    };

    mView.refresh = function () {

        mAnimator.stop();

        mView._calculateMaxScroll();
        mAnimator.setBounds(Math.min(0, -mView._MaxScroll), 0, mView._ParentSize / 2.5);
//        if (mScrollingWrapper[mParentProp]) {
//            mAnimator.tweakIfNeeded(mView.scrollPosition, mView.setPosition);
//        } else {
            mView.setPosition(0);
//        }
    };

    mView.reflow = function () {
        var container = mView.container, tmpHeight = container.offsetHeight, tmpWidth = container.offsetWidth;

        if ((tmpHeight === 0) || (tmpHeight === mParentHeight && tmpWidth === mParentWidth)) {
            return;
        }

        mView._ParentSize = container[mParentProp];
        mParentHeight = tmpHeight;
        mParentWidth = tmpWidth;
        mView.refresh();
    };

    mView.getMaxPosition = function () {
        return mView._MaxScroll;
    };

    mView.destroy = function () {
        window.removeEventListener('resize', eventResize);
        clearTimeout(mView.resizeTimeout);
    };

    mView.handleEvent = function (e) {
        switch (e.type) {
        case STRINGS.fling:
            if (mAnimator.inBounds(mView.scrollPosition))
                eventFling(e);
            break;
        case STRINGS.pointerdown:
            eventPointerDown(e);
            break;
        case STRINGS.pointermove:
            e.origin.preventDefault();
            eventPointerMove(e);
            break;
        case STRINGS.pointerup:
            eventPointerUp(e);
            break;
        }
        e.release();
    };

    //======================== construction part ========================
    mView.container = element;
    mView.scrollPosition = mView.mTopOffset;

    eventFling = (function (isVertical) {
        if (isVertical)
            return function (e) {
                if (e.direction === STRINGS.vertical) {
                    mAnimator.startFling(mView.scrollPosition, e.speed, mView.setPosition);
                }
            };

        return function (e) {
            if (e.direction !== STRINGS.vertical) {
                mAnimator.startFling(mView.scrollPosition, e.speed, mView.setPosition);
            }
        };

    })(mDirection === STRINGS.vertical);

    mView.setPosition = (function (enableListener) {
        if (enableListener) {
            return function (position, force, typeOfMotion, e) {
                mView.scrollPosition = force ? position : mAnimator.checkBounds(position);
                mView.scrollPosition = position
                mTransitionArray[1] = mView.mTopOffset + mView.scrollPosition;
                mScrollingWrapper.style[mTransformName] = mTransitionArray.join("");
                o.onScroll(mView.scrollPosition, typeOfMotion || STRINGS.move, e);
            };
        }
        return function (position, force) {
            mView.scrollPosition = force ? position : mAnimator.checkBounds(position);
            mTransitionArray[1] = mView.scrollPosition;
            mScrollingWrapper.style[mTransformName] = mTransitionArray.join("");
        };
    })((o && typeof o.onScroll === 'function'))

    if (mDirection === STRINGS.vertical) {
        mTransitionArray[0] = "translate3d(0, ";
        mTransitionArray[2] = "px, 0) scale(1)";
    } else {
        mTransitionArray[0] = "translate3d(";
        mTransitionArray[2] = "px, 0, 0) scale(1)";
    }

    mTransitionName = addVendorPrefix("transition");
    mTransformName = addVendorPrefix("transform");

    var validPosition = ['fixed', 'relative', 'absolute'], tmp = validPosition.indexOf(window.getComputedStyle(element, null).position);
    element.style.position = (tmp === -1) ? 'relative' : validPosition[tmp];
    element.style.overflow = 'hidden';

    mScrollingWrapper = element.firstElementChild;
    mScrollingWrapper.style[(mDirection === STRINGS.vertical) ? 'width' : 'height'] = '100%';
    mScrollingWrapper.style.margin = 0;
    mScrollingWrapper.style.position = 'absolute';
    mScrollingWrapper.style[mTransitionName] = 'transform 0ms';

    mView.reflow();
    window.addEventListener('resize', eventResize, false);
    //==================================================================

    return mView;
}