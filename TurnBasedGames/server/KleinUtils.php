<?php
class KleinUtils {
  static function addLogicResponder($klein, $responderClass, $requestType='GET', $override='') {
    $responder = new $responderClass();
    $url_path = $override ?: $responder->getURLPath();
    $klein->respond($requestType, $url_path,
      function ($request) use ($responder) {
        return $responder->getResponse($request);
      }
    );
  }

  static function addHTMLResponder($klein, $responderClass, $requestType='GET', $override='') {
    $responder = new $responderClass();
    $url_path = $override ?: $responder->getURLPath();
    $klein->respond($requestType, $url_path,
      function ($request) use ($responder) {
        return KleinUtils::wrapPageContent($responder->getResponse($request));
      }
    );
  }

  static function wrapPageContent($content) {
    ob_start(); ?>
    <!DOCTYPE html>
    <html>
      <head>
        <!-- Bootstrap core CSS -->
        <link href="/vendor/twbs/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="/style.css">
        <script src="/vendor/jquery/dist/jquery.min.js"></script>
      </head>
      <body>
        <?php echo $content; ?>
      </body>
    </html>
    <?php
    return ob_get_clean();
  }
}
?>
