import 'jest-styled-components'

import { render } from '../../test/testUtils'
import Home from './index'

describe('Home page', () => {
  it('should a sample test', () => {
    const { getByTestId } = render(<Home />)
    expect(getByTestId('home')).toHaveClass('container')
  })
})
