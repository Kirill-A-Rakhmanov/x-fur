import React from "react";
import qs from "qs";

import styles from "./Filters.module.scss";
import {
  CategoryOptions,
  CollectionOptions,
  Filter,
  SortOptions,
} from "@/widgets/widgets";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  clearFilter,
  fetchItems,
  queryParams,
  selectFilter,
  selectOptions,
  setFilter,
} from "@/entities/entities";
import { useNavigate } from "react-router-dom";

export const Filters = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { order, sortby, collection, category } = useAppSelector(selectFilter);
  const params = useAppSelector(selectFilter);
  const { sortOptions, categoryOptions, collectionOptions } =
    useAppSelector(selectOptions);
  const isMounted = React.useRef(false);

  // Вызывается при изменение параметров поиска и меняет ссылку. При первом рендере ничего не добавляет
  React.useEffect(() => {
    if (isMounted.current) {
      const params: queryParams = new Object();
      sortby ? (params.sortby = sortby) : "";
      order ? (params.order = order) : "";
      collection ? (params.collection = collection) : "";
      category ? (params.category = category) : "";

      const queryParams = qs.stringify(params);

      navigate(`?${queryParams}`);
    }
  }, [sortby, order, collection, category]);

  React.useEffect(() => {
    if (isMounted.current) {
      dispatch(fetchItems(params));
    }
  }, [params]);

  // вызывается при первом рендере и должно устанавливать параметры фильтрации, если они есть в ссылке
  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      dispatch(setFilter(params));
    } else {
      dispatch(fetchItems(params));
    }
    isMounted.current = true;

    return () => {
      dispatch(clearFilter());
    };
  }, []);

  return (
    <section className={styles.filters}>
      <div className={[styles.container, "_container"].join(" ")}>
        <div className={styles.content}>
          <Filter title={"Sort"} list={<SortOptions options={sortOptions} />} />
          <Filter
            title={"Category"}
            list={<CategoryOptions options={categoryOptions} />}
          />
          <Filter
            title={"Collection"}
            list={<CollectionOptions options={collectionOptions} />}
          />
        </div>
      </div>
    </section>
  );
};
