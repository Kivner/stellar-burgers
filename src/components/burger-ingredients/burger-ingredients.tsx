import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '@ui';
import { constructorSelectors, useSelector } from '../../services/store';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector(constructorSelectors.getAllIngredients);

  // Мемоизированные списки ингредиентов по категориям
  const buns: TIngredient[] = useMemo(
    () => ingredients.filter((it) => it.type === 'bun'),
    [ingredients]
  );
  const mains: TIngredient[] = useMemo(
    () => ingredients.filter((it) => it.type === 'main'),
    [ingredients]
  );
  const sauces: TIngredient[] = useMemo(
    () => ingredients.filter((it) => it.type === 'sauce'),
    [ingredients]
  );

  // Состояние текущей активной вкладки
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  // Refs для заголовков разделов (для скролла)
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Хуки для отслеживания видимости разделов
  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  // Эффект для автоматического переключения вкладок при скролле
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Обработчик клика по вкладке
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Рендерим UI компонент, передавая все необходимые пропсы
  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
