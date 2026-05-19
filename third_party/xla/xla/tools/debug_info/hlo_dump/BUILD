load("@rules_cc//cc:cc_library.bzl", "cc_library")
load("//tools/build_defs/cc:cc_embed_data.bzl", "cc_embed_data")
load(
    "//xla:xla.default.bzl",
    "xla_cc_test",
    "xla_js_binary",
    "xla_js_test_suite",
    "xla_ts_library",
)

package(
    # copybara:uncomment default_applicable_licenses = ["//tensorflow:license"],
    default_visibility = ["//visibility:public"],
)

cc_library(
    name = "hlo_lexer",
    srcs = ["hlo_lexer.cc"],
    hdrs = ["hlo_lexer.h"],
    compatible_with = ["//buildenv/target:libtpu"],
    deps = [
        "@com_google_absl//absl/strings",
        "@com_googlesource_code_re2//:re2",
    ],
)

xla_cc_test(
    name = "hlo_lexer_test",
    srcs = ["hlo_lexer_test.cc"],
    deps = [
        ":hlo_lexer",
        "//xla/tsl/platform:test",
        "//xla/tsl/platform:test_main",
        "@com_google_absl//absl/strings",
        "@com_google_absl//absl/types:span",
    ],
)

xla_ts_library(
    name = "hlo_dump_ui",
    srcs = [
        "hlo_dump_ui.ts",
    ],
    compatible_with = ["//buildenv/target:libtpu"],
    deps = [
        "//third_party/javascript/safevalues",
        "//third_party/javascript/safevalues/dom",
        "//xla/tools/debug_info/graph_view:graph_renderer",
    ],
)

xla_ts_library(
    name = "hlo_dump_ui_tests",
    testonly = True,
    srcs = ["hlo_dump_ui_test.ts"],
    deps = [
        ":hlo_dump_ui",
        "//third_party/javascript/typings/jasmine",
    ],
)

xla_js_test_suite(
    name = "hlo_dump_ui_test_suite",
    test_lib = ":hlo_dump_ui_tests",
)

xla_js_binary(
    name = "hlo_dump_ui_bin",
    compatible_with = ["//buildenv/target:libtpu"],
    deps = [":hlo_dump_ui"],
)

genrule(
    name = "hlo_dump_ui_bin_sanitized",
    srcs = [":hlo_dump_ui_bin.js"],
    outs = ["hlo_dump_ui_bin_sanitized.js"],
    cmd = "sed 's/google" + "3/g3/g' $(location :hlo_dump_ui_bin.js) > $@",
    compatible_with = ["//buildenv/target:libtpu"],
)

cc_embed_data(
    name = "hlo_dump_assets",
    srcs = [
        "hlo_dump_template.html",
        "hlo_dump_style.css",
        "hlo_dump_ui_bin_sanitized.js",
    ],
    outs = [
        "hlo_dump_assets.cc",
        "hlo_dump_assets.h",
        "hlo_dump_assets_data.o",
    ],
    compatible_with = ["//buildenv/target:libtpu"],
    embedopts = ["--namespace=xla::tools::debug_info"],
)

cc_library(
    name = "hlo_dump_utils",
    srcs = ["hlo_dump_utils.cc"],
    hdrs = ["hlo_dump_utils.h"],
    compatible_with = ["//buildenv/target:libtpu"],
    deps = [
        ":hlo_dump_assets",
        ":hlo_lexer",
        "//third_party/gloop/base:file_toc",
        "//third_party/gloop/util/endian",
        "//third_party/gloop/util/gtl:flat_set",
        "//xla:shape_util",
        "//xla/service:hlo_proto_cc",
        "//xla/tsl/platform:logging",
        "@com_google_absl//absl/base",
        "@com_google_absl//absl/container:flat_hash_map",
        "@com_google_absl//absl/container:flat_hash_set",
        "@com_google_absl//absl/strings",
        "@com_google_absl//absl/strings:str_format",
        "@com_google_absl//absl/types:span",
        "@com_googlesource_code_re2//:re2",
        "@riegeli//riegeli/bytes:string_writer",
        "@riegeli//riegeli/zlib:zlib_writer",
    ],
)

xla_cc_test(
    name = "hlo_dump_utils_test",
    size = "small",
    srcs = ["hlo_dump_utils_test.cc"],
    deps = [
        ":hlo_dump_utils",
        "//xla/service:hlo_proto_cc",
        "//xla/tsl/platform:test",
        "//xla/tsl/platform:test_main",
        "@com_google_absl//absl/container:flat_hash_map",
        "@com_google_absl//absl/strings",
    ],
)
