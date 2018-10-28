import React from 'react';
import { FlatList as RNFlatList } from 'react-native';

export default class FlatList extends React.Component {
  static defaultProps = {
    extraData: {},
    renderItem: () => { },
  }

  viewabilityConfig = {
    minimumViewTime: 1,
    viewAreaCoveragePercentThreshold: 0,
  }

  constructor(props) {
    super(props);

    this.state = {
      viewableItemIndices: [],
    };
  }

  onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length) {
      this.setState({ viewableItemIndices: viewableItems.map(item => item.index) });
    }
  }

  render() {
    const { viewableItemIndices } = this.state;
    const { renderItem, extraData } = this.props;

    return (
      <RNFlatList
        {...this.props}
        renderItem={props => renderItem({ ...props, viewableItemIndices })}
        extraData={Object.assign({}, extraData, viewableItemIndices)}
        viewabilityConfig={this.viewabilityConfig}
        onViewableItemsChanged={this.onViewableItemsChanged}
      />
    );
  }
}
