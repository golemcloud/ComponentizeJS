#include "builtins.h"

namespace TextDecoder
{
  namespace Slots
  {
    enum
    {
      Count
    };
  };

  const unsigned ctor_length = 0;

  bool check_receiver(JSContext *cx, JS::HandleValue receiver, const char *method_name);

  bool decode(JSContext *cx, unsigned argc, JS::Value *vp)
  {
    METHOD_HEADER(1)

    // Default to empty string if no input is given.
    if (args[0].isUndefined())
    {
      args.rval().set(JS_GetEmptyStringValue(cx));
      return true;
    }

    size_t length;
    uint8_t *data = value_to_buffer(cx, args[0], "TextDecoder#decode: input", &length);
    if (!data)
    {
      return false;
    }

    JS::RootedString str(cx, JS_NewStringCopyUTF8N(cx, JS::UTF8Chars((char *)data, length)));
    if (!str)
      return false;

    args.rval().setString(str);
    return true;
  }

  bool encoding_get(JSContext *cx, unsigned argc, JS::Value *vp)
  {
    METHOD_HEADER(0)

    JS::RootedString str(cx, JS_NewStringCopyN(cx, "utf-8", 5));
    if (!str)
      return false;

    args.rval().setString(str);
    return true;
  }

  const JSFunctionSpec methods[] = {JS_FN("decode", decode, 1, JSPROP_ENUMERATE), JS_FS_END};

  const JSPropertySpec properties[] = {JS_PSG("encoding", encoding_get, JSPROP_ENUMERATE),
                                       JS_STRING_SYM_PS(toStringTag, "TextDecoder", JSPROP_READONLY),
                                       JS_PS_END};
  bool constructor(JSContext *cx, unsigned argc, JS::Value *vp);
  CLASS_BOILERPLATE(TextDecoder)

  bool constructor(JSContext *cx, unsigned argc, JS::Value *vp)
  {
    CTOR_HEADER("TextDecoder", 0);

    JS::RootedObject self(cx, JS_NewObjectForConstructor(cx, &class_, args));

    args.rval().setObject(*self);
    return true;
  }
} // namespace TextDecoder