export default {
    firefox: {
      runtime: {
        onMessage: {
          addListener: jest.fn()
        },
      },
      tabs: {
        query: jest.fn(),
        sendMessage: jest.fn()
      }
    },
    chrome: {
      runtime: {
        onMessage: {
          addListener: jest.fn()
        },
      },
      tabs: {
        query: jest.fn(),
        sendMessage: jest.fn()
      }
    }
}
