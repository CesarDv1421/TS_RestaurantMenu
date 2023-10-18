const CustomIngredientsCardList = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <div className='pt-10 px-5 flex flex-col gap-6'>
      <h2>{title}</h2>
      <div className='flex flex-wrap gap-5'>{children}</div>
    </div>
  );
};

export default CustomIngredientsCardList;
