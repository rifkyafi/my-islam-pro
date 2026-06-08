export function StatsStrip() {
  const stats = [
    { value: '12', label: 'Tema Kehidupan' },
    { value: '800+', label: 'Hadis Tersedia' },
    { value: '9', label: 'Kitab Hadis' },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 bg-[#132830] border-y border-[#C9A84C]/18">
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col items-center py-11 px-8 border-b md:border-b-0 md:border-r border-[#C9A84C]/18 gap-2 last:border-0">
          <span className="font-cormorant text-[3.25rem] font-light text-[#C9A84C] leading-none">{stat.value}</span>
          <span className="text-[0.72rem] font-medium tracking-[3px] uppercase text-[#7A8F96]">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
