import { debounce } from 'lodash'
import { useCallback } from 'react'

export const useDebounceFn = (fnToDebounce, delay = 500) => {
    if (isNaN(delay)) {
        throw new Error('Delay value should be a number')
    }

    if (!fnToDebounce || (typeof fnToDebounce !== 'function')) {
        throw new Error('Debounce must have a function')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(debounce(fnToDebounce, delay), [fnToDebounce, delay])
}