import Link from './link'
import Logo from './logo'
import MaxWidthLarge from './maxWidthLarge'

export default () => {
  return (
    <MaxWidthLarge
      as="nav"
      class="flex w-full items-center justify-between p-4 sm:p-8"
    >
      <Logo />
      <div class="flex space-x-2">
        <Link href="/explore">Explore</Link>
        <Link href="/compare">Compare</Link>
      </div>
    </MaxWidthLarge>
  )
}
