import Logo from './logo'
import MaxWidthLarge from './maxWidthLarge'

export default () => {
  return (
    <footer class="bg-black">
      <MaxWidthLarge class="flex p-4 sm:p-8">
        <Logo />
      </MaxWidthLarge>
    </footer>
  )
}
