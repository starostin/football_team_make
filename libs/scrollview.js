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
        mView.mTopOffset = o.topOffset;
        mView.X = [];
        mView.Y = [];

    function eventPointerDown(e) {
        mView.X = [];
        mView.Y = [];
        mView.X.push(e.clientX);
        mView.Y.push(e.clientY);
        mView.beginElIndex = e.origin.target.parentNode.getAttribute('data-index');
        if(mView.directionDefined){
            if(typeof o.onScrollStart === 'function' && mView.directionVert){
                o.onScrollStart(e);
            }else if(typeof o.onSwipeStart === 'function' && !mView.directionVert){
                o.onSwipeStart(e, mView.beginElIndex)
            }
        }
        mAnimator.stop();
        mLastPointerCoordinate = e[mCoordProp];

    }
    function directionVert(xArr, yArr){
        var xSum = 0, ySum = 0;
        for(var i=0; i<xArr.length; i++){
            xSum+=xArr[i];
        }
        for(var j=0; j<xArr.length; j++){
            ySum+=yArr[j];
        }
        return Math.abs(xArr[0] - xSum/xArr.length) <= Math.abs(yArr[0] - ySum/yArr.length)
    }

    function eventPointerMove(e) {

        if(Math.abs(mView.X[mView.X.length-1] - e.clientX)>10 && !mView.directionDefined){
            mView.directionVert = false;
            mView.directionDefined = true;
            eventPointerDown(e)
        }
        if(Math.abs(mView.Y[mView.Y.length-1] - e.clientY)>10 && !mView.directionDefined){
            mView.directionVert = true;
            mView.directionDefined = true;
            eventPointerDown(e)
        }
        mView.X.push(e.clientX);
        mView.Y.push(e.clientY);
        if(mView.X.length < 10 && !mView.directionDefined) return;
        if(mView.X.length>= 10 && !mView.directionDefined){
            mView.directionVert = directionVert(mView.X, mView.Y);
            mView.directionDefined = true;
            eventPointerDown(e)
        }
        if((mView.directionDefined && mView.directionVert) || (mView.X.length<10 && !mView.directionDefined)){
            mView.setPosition(mView.scrollPosition - (mLastPointerCoordinate - e[mCoordProp]), null, null, e);
            mLastPointerCoordinate = e[mCoordProp];
        }else if(mView.directionDefined && !mView.directionVert){
            if(typeof o.onSwipe === 'function'){
                o.onSwipe(e, mView.beginElIndex)
            }
        }
    }

    function eventPointerUp(e) {
        mView.X = [];
        mView.Y = [];

        if(mView.directionDefined && !mView.directionVert){
            mView.directionDefined = false;
            mView.directionVert = null;
            if(typeof o.onSwipeEnd === 'function' && e && mView.beginElIndex){
                o.onSwipeEnd(e, mView.beginElIndex)
            }
            return;
        }
        if(typeof o.onScrollEnd === 'function'){
            o.onScrollEnd(e)
        }
        mView.setPosition(mView.scrollPosition - (mLastPointerCoordinate - e[mCoordProp]), true);
        mAnimator.tweakIfNeeded(mView.scrollPosition, mView.setPosition);
        mView.directionDefined = false;
        mView.directionVert = null;
    }

    function eventResize() {
        clearTimeout(mView.resizeTimeout);
        mView.resizeTimeout = setTimeout(mView.reflow, 150);
    }

    mView._calculateMaxScroll = function () {
        mView._MaxScroll = mScrollingWrapper[mParentProp] - mView._ParentSize;
    };

    mView.scroll = function (shift, duration) {
        mAnimator.animate(mView.scrollPosition, mView.scrollPosition + shift, duration, mView.setPosition, 'easeOutQuad');
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
//                mView.scrollPosition = force ? position : mAnimator.checkBounds(position);
                position= position >> 0;
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