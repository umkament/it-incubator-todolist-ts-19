import { Dispatch } from "redux";
import { appActions } from "app/app.reducer";
import { ResponseType } from "common/types/common.types";

/**
 *  Обрабатывает ошибку, полученную с сервера и обновляет состояние приложения
 * @param data - данные полученные с сервера
 * @param dispatch - функция для обновления состояние приложения
 * @param showError - флаг, указывающий, нужно ли оображать ошибку
 * @returns {void} - ничего не возвращает
 */
export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError){
    dispatch(appActions.setAppError({error: data.messages.length ? data.messages[0] : "Some error occurred" }))
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
