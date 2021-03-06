'use strict';

import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  Animated,
  InteractionManager,
} from 'react-native';

import reactMixin from 'react-mixin';

import TimerMixin from 'react-timer-mixin';

import {List} from 'immutable';

import TrackerSwiper from './TrackerSwiper';

import TrackerScroll from './TrackerScroll';

import {MoveDownResponderAnim} from '../animation/MoveDownResponderAnim';

import TrackerStore from '../../model/Trackers';

import {commonStyles} from '../styles/common';

import {slideHeight} from './styles/slideStyles';

import {caller} from '../../utils/lang';

export default class Trackers extends Component {
  _opacity = new Animated.Value(0);

  _moveDown = new MoveDownResponderAnim(slideHeight);

  constructor(props) {
    super(props);

    const { trackers } = this.props;
    this.state = {
      swTrackers: new List(),
      scTrackers: new List(),
      swiperEnabled: true,
      index: 0,
    };
  }

  shouldComponentUpdate(props, state) {
    return this.state.swTrackers !== state.swTrackers ||
           this.state.scTrackers !== state.scTrackers ||
           this.state.swiperEnabled !== state.swiperEnabled;
  }

  componentWillUnmount() {
    this._moveDown.dispose();
  }

  componentDidMount() {
    const {
      trackers,
      onSwiperMoveDown,
      onSwiperMoveDownStart,
    } = this.props;

    if (trackers) {
      this._renderTracker(trackers.first(), () => {
        this._renderTrackers(trackers);
      });
    }

    this._moveDown.subscribe(this._swiper.responder,
      onSwiperMoveDown,
      () => {
        this.setState({
          swiperEnabled: false,
        });
        InteractionManager.runAfterInteractions(() => {
          caller(onSwiperMoveDownStart);
        });
      });
  }

  componentWillReceiveProps({ trackers }) {
    if (this.props.trackers !== trackers) {
      this._renderTrackers(trackers);
    }
  }

  cancelEdit() {
    this._swiper.cancelEdit();
    caller(this.props.onCancel);
  }

  get _swiper() {
    return this.refs.swiper;
  }

  get _bscroll() {
    return this.refs.bscroll;
  }

  get _sscroll() {
    return this.refs.sscroll;
  }

  _renderTracker(tracker, callback) {
    this.setState({
      swTrackers: new List([tracker]),
    }, () => {
      Animated.timing(this._opacity, {
        duration: 500,
        toValue: 1,
      }).start(callback);
    });
  }

  _renderTrackers(trackers, callback) {
    this.setState({
      swTrackers: trackers,
    });

    this.setTimeout(() => {
      this.setState({
        scTrackers: trackers,
      }, callback);
    });
  }

  _onEdit(tracker: Tracker) {
    this._swiper.showEdit();
    caller(this.props.onEdit, tracker);
  }

  _onRemove(tracker: Tracker) {
    caller(this.props.onRemove, tracker);
  }

  _onScaleStart() {
    this._bscroll.hide();
    this._bscroll.scrollTo(this.state.index, false);
    this._sscroll.scrollTo(this.state.index, false);
  }

  _onScaleMove(dv) {
    this._bscroll.opacity = 1 - dv;
    this._sscroll.opacity = 1 - dv;
    caller(this.props.onSwiperScaleMove, dv);
  }

  _onScaleDone() {
    this._bscroll.show();
    this._sscroll.show();
    this._swiper.hide();
  }

  _onTap() {
    if (this._moveDown.in) {
      this._moveDown.animateOut(
        this.setState.bind(this, {
          swiperEnabled: true,
        })
      );
    }
  }

  _onCenterSlideTap(index: number) {
    this._bscroll.hide();
    this._sscroll.hide();

    this._swiper.scrollTo(index, () => {
      this._swiper.show();
    }, false);
  }

  _onSmallSlideTap(index: number) {
    this._bscroll.scrollTo(index, true);
    this._sscroll.scrollTo(index, true);
  }

  _onSlideChange(index: number, previ: number) {
    this.setState({ index });
    caller(this.props.onSlideChange, index, previ);
  }

  render() {
    const { swTrackers, scTrackers, swiperEnabled } = this.state;
    const { style } = this.props;

    const combinedStyle = [
      style, this._moveDown.style, {opacity: this._opacity},
    ];
    return (
      <Animated.View style={combinedStyle}>
        <TrackerScroll
          ref='bscroll'
          {...this.props}
          trackers={scTrackers}
          style={styles.bigScroll}
          scale={1 / 1.6}
          onCenterSlideTap={::this._onCenterSlideTap}
        />
        <TrackerScroll
          ref='sscroll'
          trackers={scTrackers}
          style={styles.smallScroll}
          scale={1 / 4}
          responsive={false}
          onSlideTap={::this._onSmallSlideTap}
        />
        <TrackerSwiper
          ref='swiper'
          {...this.props}
          enabled={swiperEnabled}
          trackers={swTrackers}
          style={commonStyles.absFilled}
          onScaleStart={::this._onScaleStart}
          onScaleMove={::this._onScaleMove}
          onScaleDone={::this._onScaleDone}
          onTap={::this._onTap}
          onRemove={::this._onRemove}
          onEdit={::this._onEdit}
          onSlideChange={::this._onSlideChange}
        />
      </Animated.View>
    )
  }
};

reactMixin(Trackers.prototype, TimerMixin);

const styles = StyleSheet.create({
  bigScroll: {
    flex: 0.65,
  },
  smallScroll: {
    flex: 0.35,
  },
});
