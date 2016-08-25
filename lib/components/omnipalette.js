/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import EtchComponent from '../etch-component'
import OmnipaletteItem from './omnipalette-item'
import TextEditorView from './text-editor-view'

let fuzzyFilter

export default class Omnipalette extends EtchComponent {
  constructor (props) {
    super(props)

    // let _this = this
    // TODO: Take this out - just for validation purposes now
    // this.props = {
    //   maxItems: Infinity,
    //   scheduleTimeout: null,
    //   inputThrottle: 50,
    //   cancelling: false
    // }
  }

  getFuzzyFilter () {
    if (this.props.alternateScoring) {
      return require('fuzzaldrin-plus').filter
    }
    return require('fuzzaldrin').filter
  }

  renderList () {
    if (!this.props.items) return

    let filteredItems = this.props.items
    if (this.props.filterQuery && this.props.filterQuery.length) {
      fuzzyFilter = fuzzyFilter || this.getFuzzyFilter()
      filteredItems = fuzzyFilter(this.props.items, this.props.filterQuery, {
        key: this.props.filterKey
      })
    }

    return filteredItems.filter((item, i) => {
      return i < this.props.maxItems
    })
      .map((item, i) => {
        return (
          <OmnipaletteItem selected={this.props.selectedItem === i} item={item} />
        )
      })
  }

  render () {
    return (
      <div className='select-list'>
        <div style={{
          display: this.props.errorMessage ? 'block' : 'none'
        }} className='error-message'>
          {this.props.errorMessage}
        </div>
        <div className='loading'>
          <span className='loading-message'></span>
          <span className='badge'></span>
        </div>
        <TextEditorView mini setTextEditor={this.props.setTextEditor} />
        <ol className='list-group'>
          {this.renderList()}
        </ol>
      </div>
    )
  }
}