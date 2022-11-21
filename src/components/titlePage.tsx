import DialogRoutes from '/src/components/dialogRoutes'
import Title from '/src/components/title'

export default () => {
  const location = useLocation()

  return (
    <div class="flex items-center justify-center space-x-4">
      <Title level={1} class="mb-0.5">
        {location.pathname.substring(1).toUpperCase()}
      </Title>
      <DialogRoutes button={{ primary: true }} />
    </div>
  )
}
