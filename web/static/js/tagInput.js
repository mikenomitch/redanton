import { h, render, Component } from 'preact'
import TokenInput from 'preact-token-input'

/** @jsx h */

class TokenInputWrapper extends Component {
  onChange({value}){
    const downcased = value.map((s) => s.toLowerCase())
    this.setState({tags: downcased, committedTags: downcased})
  }

  render({name, initialVal}, { tags, committedTags }) {
    let ct = committedTags || []

    return (
      <div>
        <TokenInput
          placeholder="Add tags"
          value={tags || initialVal}
          onChange={this.onChange.bind(this)}
        />
        <input hidden name={name} value={committedTags} />
      </div>
    )
  }
}

function replaceTagInput(elem) {
  const input = elem.children[0]
  const name = `${input.name}`
  const initialVal = `${input.value}`
  input.remove()
  render(<TokenInputWrapper initialVal={initialVal} name={name} />, elem)
}

function replaceTagInputs() {
  let tagInputs = document.getElementsByClassName('tag-input')

  for (var i = 0; i < tagInputs.length; i++) {
    replaceTagInput(tagInputs[i])
  }
}

replaceTagInputs()