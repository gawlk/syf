import SYF from '/src/assets/brand/SYF.svg'

export default () => {
  return (
    <Link href="/" class="mx-4">
      <span class="sr-only">SYF</span>
      <SYF class="h-8 w-auto text-stone-300 transition-colors duration-200 hover:text-stone-400 sm:h-10" />
    </Link>
  )
}
