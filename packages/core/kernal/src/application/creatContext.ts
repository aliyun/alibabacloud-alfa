import { createContext as createBrowserVMContext, ContextOption } from '@alicloud/console-os-browser-vm';

export const createContext = async (option: ContextOption) => {
  return createBrowserVMContext(option)
}