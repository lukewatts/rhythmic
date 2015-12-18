(function($) {
    var defaults = {
        baseLineHeight: "16",
        heightUnits: "px"
    };

    // Make simpler variables from our defaults
    var baseLineHeight = defaults['baseLineHeight'];
    var heightUnits = defaults['heightUnits'];

    /**
    * jQuery Plugin to set the height of all images on a page to
    * a vertical rhythm.
    */
    $.fn.rhythmic = function() {
        'use strict'

        function logit(logthis) {
            return console.log(logthis);
        }

        /**
         * This will check if a number is between a an b.
         *
         * @var a (int)          Min value
         * @var b (int)          Max value
         * @var inclusive (bool) Allows for specifying if the check a<>b should return true or false
         * @return (bool)
         */
        Number.prototype.between = function(a, b, inclusive) {
            var min = Math.min(a, b),
                max = Math.max(a, b);

            return inclusive ? this >= min && this <= max : this > min && this < max;
        }

        $(this).each(function() {
            var sizes = {
                1: [0, 95, (baseLineHeight * 3) + heightUnits],
                2: [96, 143, (baseLineHeight * 6) + heightUnits],
                3: [144, 191, (baseLineHeight * 9) + heightUnits],
                4: [192, 239, (baseLineHeight * 12) + heightUnits],
                5: [240, 287, (baseLineHeight * 15) + heightUnits],
                6: [288, 335, (baseLineHeight * 18) + heightUnits]
            }, size;

            var $this = $(this);

            // Get the parent element to allow for columns/grids etc.
            var $parentWidth = $this.parent().width();
            logit("Parent Element Width: " + $parentWidth);

            // Get the starting image width and height
            // NOTE: This may not be the actual true dimension of the image
            var $originalImgWidth  = $this.width();
            var $originalImgHeight = $this.height();
            logit("Original Img Width: "  + $originalImgWidth);
            logit("Original Img Height: " + $originalImgHeight);

            // Get aspect ratio
            var $aspectRatio = $originalImgHeight / $originalImgWidth;
            logit($aspectRatio);

            // Force the image to be 100% width so we can determine the parents
            // width minus padding.
            $this.css('width', '100%');
            var $maxImgWidth = $this.width(); // Get the new width

            // Reset the width to it's original to avoid problems later
            $this.css('width', 'auto');

            logit("The width we must stay within: " + $maxImgWidth);

            if ($originalImgWidth > $maxImgWidth) {
                var $newHeight = $maxImgWidth * $aspectRatio;
                var $newWidth  = $maxImgWidth;
                logit("New Height: " + $newHeight);
                $this.css({
                    'width': $newWidth,
                    'height': $newHeight
                });
            }

            for (size in sizes) {
                // FIXME
                // Need to make sure we aren't increasing the width of the image
                // If the current image width is less than it's original width
                // We are safe to use with auto
                // Otherwise we need to reset it's width to it's original width
                // and then we can run it through the formula
                if ($this.height().between(sizes[size][0], sizes[size][1], true)) {
                    var newHeight = sizes[size][2];
                    var newWidth = newHeight * $aspectRatio;

                    $this.css({
                        "display": "block",
                        "width": "auto",
                        "height": newHeight
                    });
                }
            }
        });
    };
})(jQuery);
