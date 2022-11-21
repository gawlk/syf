import Footer from '/src/components/footer'
import MaxWidthLarge from '/src/components/maxWidthLarge'
import Slide from '/src/components/slide'

import Landing from './components/landing'

// import Introduction from './components/introduction/index'
// import Conclusion from './components/conclusion/index'
import FinancesURL from '/src/assets/drawkit/finances.svg?url'

export default () => {
  const location = useLocation()

  console.log(location.pathname)

  return (
    <>
      <Landing />
      {/* <div class="space-y-20 sm:space-y-24 lg:p-4">
        <Introduction />
        <Conclusion />
      </div> */}
      <MaxWidthLarge>test test</MaxWidthLarge>
      <div class="h-[67.5vh] h-[67.5dvh] sm:h-[70vh] sm:h-[70dvh] md:h-[72.5vh] md:h-[72.5dvh]">
        <Slide url={FinancesURL} class="-mt-20" />
      </div>
      <Footer />
    </>
  )
}
